import type { Express, RequestHandler } from "express";
import { COOKIE_NAME } from "@shared/const";
import { parseCookieHeader } from "./cookieParser";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export type RequestSecurityDecision = Readonly<
  | { allowed: true; reason: "not_ambient_cookie_mutation" | "same_origin" | "development_no_origin" }
  | {
      allowed: false;
      reason:
        | "cross_site_fetch"
        | "missing_origin"
        | "invalid_origin"
        | "origin_mismatch"
        | "missing_production_origin";
    }
>;

export type RequestSecurityInput = Readonly<{
  method: string;
  cookieHeader?: string;
  originHeader?: string;
  secFetchSite?: string;
  requestOrigin?: string;
}>;

function hasSessionCookie(cookieHeader: string | undefined): boolean {
  if (!cookieHeader) return false;
  return Boolean(parseCookieHeader(cookieHeader)[COOKIE_NAME]);
}

function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
      return null;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function evaluateCookieMutationOrigin(
  input: RequestSecurityInput,
  env: NodeJS.ProcessEnv = process.env
): RequestSecurityDecision {
  const method = input.method.toUpperCase();
  if (!UNSAFE_METHODS.has(method) || !hasSessionCookie(input.cookieHeader)) {
    return Object.freeze({
      allowed: true as const,
      reason: "not_ambient_cookie_mutation" as const,
    });
  }

  if (input.secFetchSite?.trim().toLowerCase() === "cross-site") {
    return Object.freeze({
      allowed: false as const,
      reason: "cross_site_fetch" as const,
    });
  }

  const isProduction = env.NODE_ENV === "production";
  const rawExpected = isProduction
    ? env.BETA_PUBLIC_ORIGIN?.trim()
    : input.requestOrigin?.trim();

  if (!rawExpected) {
    if (!isProduction && !input.originHeader?.trim()) {
      return Object.freeze({
        allowed: true as const,
        reason: "development_no_origin" as const,
      });
    }
    return Object.freeze({
      allowed: false as const,
      reason: "missing_production_origin" as const,
    });
  }

  const expectedOrigin = normalizeOrigin(rawExpected);
  if (!expectedOrigin) {
    return Object.freeze({
      allowed: false as const,
      reason: "missing_production_origin" as const,
    });
  }

  const rawOrigin = input.originHeader?.trim();
  if (!rawOrigin) {
    if (!isProduction) {
      return Object.freeze({
        allowed: true as const,
        reason: "development_no_origin" as const,
      });
    }
    return Object.freeze({
      allowed: false as const,
      reason: "missing_origin" as const,
    });
  }

  const origin = normalizeOrigin(rawOrigin);
  if (!origin) {
    return Object.freeze({
      allowed: false as const,
      reason: "invalid_origin" as const,
    });
  }

  if (origin !== expectedOrigin) {
    return Object.freeze({
      allowed: false as const,
      reason: "origin_mismatch" as const,
    });
  }

  return Object.freeze({
    allowed: true as const,
    reason: "same_origin" as const,
  });
}

function requestOrigin(req: Parameters<RequestHandler>[0]): string | undefined {
  const host = req.get("host")?.trim();
  if (!host) return undefined;
  return `${req.protocol}://${host}`;
}

export function createCookieMutationOriginGuard(
  env: NodeJS.ProcessEnv = process.env
): RequestHandler {
  return (req, res, next) => {
    const decision = evaluateCookieMutationOrigin(
      {
        method: req.method,
        cookieHeader: req.headers.cookie,
        originHeader: req.get("origin"),
        secFetchSite: req.get("sec-fetch-site"),
        requestOrigin: requestOrigin(req),
      },
      env
    );

    if (decision.allowed) {
      next();
      return;
    }

    res.set("Cache-Control", "no-store");
    res.status(403).json({
      error: "cross_origin_cookie_mutation_rejected",
      reason: decision.reason,
    });
  };
}

export function registerRequestSecurity(app: Express): void {
  app.use(createCookieMutationOriginGuard());
}
