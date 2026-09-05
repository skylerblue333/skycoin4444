import {
  AXIOS_TIMEOUT_MS,
  decodeOAuthState,
} from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import axios, { type AxiosInstance } from "axios";
import { parseCookieHeader } from "./cookieParser";
import { getSessionCookieName } from "./cookies";
import type { Request } from "express";
import { SignJWT } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";
import { evaluateBetaAdmission } from "./betaAdmission";
import { oauthProviderRuntimeEnabled } from "./betaAccessAuth";
import { sanitizeOperationalError } from "./operationalError";
import { resolveSessionTtlMs } from "./sessionPolicy";
import {
  sessionSigningKeysFromSecrets,
  verifySessionJwt,
} from "./sessionKeys";
import type {
  ExchangeTokenRequest,
  ExchangeTokenResponse,
  GetUserInfoResponse,
  GetUserInfoWithJwtRequest,
  GetUserInfoWithJwtResponse,
} from "./types/manusTypes";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

const EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
const GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
const GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;

class OAuthService {
  constructor(private client: ReturnType<typeof axios.create>) {
    if (oauthProviderRuntimeEnabled()) {
      console.info(
        "[OAuth] provider configuration",
        ENV.oAuthServerUrl ? "configured" : "missing"
      );
      if (!ENV.oAuthServerUrl) {
        console.error(
          "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
        );
      }
    }
  }

  private decodeState(state: string): string {
    return decodeOAuthState(state).redirectUri;
  }

  async getTokenByCode(
    code: string,
    state: string
  ): Promise<ExchangeTokenResponse> {
    const payload: ExchangeTokenRequest = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state),
    };

    const { data } = await this.client.post<ExchangeTokenResponse>(
      EXCHANGE_TOKEN_PATH,
      payload
    );

    return data;
  }

  async getUserInfoByToken(
    token: ExchangeTokenResponse
  ): Promise<GetUserInfoResponse> {
    const { data } = await this.client.post<GetUserInfoResponse>(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken,
      }
    );

    return data;
  }
}

const createOAuthHttpClient = (): AxiosInstance =>
  axios.create({
    baseURL: ENV.oAuthServerUrl,
    timeout: AXIOS_TIMEOUT_MS,
  });

class SDKServer {
  private readonly client: AxiosInstance;
  private readonly oauthService: OAuthService;

  constructor(client: AxiosInstance = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }

  private deriveLoginMethod(
    platforms: unknown,
    fallback: string | null | undefined
  ): string | null {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set<string>(
      platforms.filter((p): p is string => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (
      set.has("REGISTERED_PLATFORM_MICROSOFT") ||
      set.has("REGISTERED_PLATFORM_AZURE")
    )
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }

  async exchangeCodeForToken(
    code: string,
    state: string
  ): Promise<ExchangeTokenResponse> {
    return this.oauthService.getTokenByCode(code, state);
  }

  async getUserInfo(accessToken: string): Promise<GetUserInfoResponse> {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken,
    } as ExchangeTokenResponse);
    const loginMethod = this.deriveLoginMethod(
      (data as any)?.platforms,
      (data as any)?.platform ?? data.platform ?? null
    );
    return {
      ...(data as any),
      platform: loginMethod,
      loginMethod,
    } as GetUserInfoResponse;
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  private getSessionKeys() {
    return sessionSigningKeysFromSecrets(
      ENV.cookieSecret,
      ENV.previousCookieSecret
    );
  }

  private requireAppId() {
    if (!isNonEmptyString(ENV.appId)) {
      throw new Error("VITE_APP_ID must be configured before issuing sessions");
    }
    return ENV.appId;
  }

  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    if (!isNonEmptyString(openId)) {
      throw new Error("Cannot issue a session without an openId");
    }

    return this.signSession(
      {
        openId,
        appId: this.requireAppId(),
        name: options.name || "",
      },
      options
    );
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const configuredAppId = this.requireAppId();
    if (
      !isNonEmptyString(payload.openId) ||
      payload.appId !== configuredAppId
    ) {
      throw new Error("Session identity does not match this application");
    }

    const issuedAt = Date.now();
    const expiresInMs = resolveSessionTtlMs(options.expiresInMs);
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionKeys().active;

    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt(Math.floor(issuedAt / 1000))
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<{ openId: string; appId: string; name: string } | null> {
    if (!cookieValue) {
      return null;
    }

    try {
      const { payload } = await verifySessionJwt(
        cookieValue,
        this.getSessionKeys()
      );
      const { openId, appId, name } = payload as Record<string, unknown>;

      if (!isNonEmptyString(openId) || !isNonEmptyString(appId)) {
        console.warn("[Auth] Session payload missing required identity fields");
        return null;
      }

      if (!isNonEmptyString(ENV.appId) || appId !== ENV.appId) {
        console.warn("[Auth] Session appId does not match this application");
        return null;
      }

      return {
        openId,
        appId,
        name: typeof name === "string" ? name : "",
      };
    } catch (error) {
      console.warn(
        "[Auth] Session verification failed",
        sanitizeOperationalError(error)
      );
      return null;
    }
  }

  async getUserInfoWithJwt(
    jwtToken: string
  ): Promise<GetUserInfoWithJwtResponse> {
    const payload: GetUserInfoWithJwtRequest = {
      jwtToken,
      projectId: ENV.appId,
    };

    const { data } = await this.client.post<GetUserInfoWithJwtResponse>(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );

    const loginMethod = this.deriveLoginMethod(
      (data as any)?.platforms,
      (data as any)?.platform ?? data.platform ?? null
    );
    return {
      ...(data as any),
      platform: loginMethod,
      loginMethod,
    } as GetUserInfoWithJwtResponse;
  }

  async authenticateRequest(req: Request): Promise<AuthenticatedUser> {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(getSessionCookieName());

    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }

    const session = await this.verifySession(sessionToken);

    if (!session) {
      throw ForbiddenError("Invalid session");
    }

    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }

    const sessionUserId = session.openId;
    let user = await db.getUserByOpenId(sessionUserId);

    if (!user) {
      if (!oauthProviderRuntimeEnabled()) {
        throw ForbiddenError("User not found");
      }

      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await db.upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
        });
        user = await db.getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error(
          "[Auth] Failed to sync user from OAuth:",
          sanitizeOperationalError(error)
        );
        throw ForbiddenError("Failed to sync user info");
      }
    }

    if (!user) {
      throw ForbiddenError("User not found");
    }

    const admission = evaluateBetaAdmission({
      openId: session.openId,
      email: user.email,
    });
    if (!admission.allowed) {
      throw ForbiddenError("Account is not admitted to this invitation-only beta");
    }

    await db.upsertUser({
      openId: session.openId,
    });

    return user;
  }
}

const CRON_OPEN_ID_PREFIX = "cron_";

export type AuthenticatedUser = User & {
  taskUid?: string;
  isCron?: boolean;
};

function buildCronUser(
  userInfo: GetUserInfoWithJwtResponse
): AuthenticatedUser {
  const now = new Date();
  return {
    id: `cron-${userInfo.openId}`,
    openId: userInfo.openId,
    username: null,
    name: userInfo.name || "Manus Scheduled Task",
    bio: null,
    avatar: null,
    profileVisibility: "public",
    email: null,
    balance: null,
    role: "user",
    verified: false,
    createdAt: now,
    updatedAt: now,
    taskUid: userInfo.taskUid ?? undefined,
    isCron: true,
  };
}

export const sdk = new SDKServer();
