import type { CookieOptions, Request } from "express";
import {
  COOKIE_NAME,
  PRODUCTION_COOKIE_NAME,
} from "@shared/const";

export function getSessionCookieName(
  env: NodeJS.ProcessEnv = process.env
): string {
  return env.NODE_ENV === "production"
    ? PRODUCTION_COOKIE_NAME
    : COOKIE_NAME;
}

export function getSessionCookieNamesToClear(
  env: NodeJS.ProcessEnv = process.env
): readonly string[] {
  const active = getSessionCookieName(env);
  return active === COOKIE_NAME
    ? Object.freeze([active])
    : Object.freeze([active, COOKIE_NAME]);
}

function isSecureRequest(req: Request): boolean {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<
  CookieOptions,
  "domain" | "httpOnly" | "path" | "sameSite" | "secure"
> {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure:
      process.env.NODE_ENV === "production" ? true : isSecureRequest(req),
  };
}
