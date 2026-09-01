import {
  COOKIE_NAME,
  ONE_YEAR_MS,
  OAUTH_STATE_COOKIE,
  decodeOAuthState,
} from "@shared/const";
import { parseCookieHeader } from "./cookieParser";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function isValidOAuthRedirectUri(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    const decodedState = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader(req.headers.cookie ?? "")[
      OAUTH_STATE_COOKIE
    ];
    if (!decodedState.nonce || decodedState.nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }

    if (!isValidOAuthRedirectUri(decodedState.redirectUri)) {
      res.clearCookie(OAUTH_STATE_COOKIE, {
        path: "/",
        secure: true,
        sameSite: "none",
      });
      res.status(400).json({ error: "invalid oauth redirect" });
      return;
    }

    res.clearCookie(OAUTH_STATE_COOKIE, {
      path: "/",
      secure: true,
      sameSite: "none",
    });

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
