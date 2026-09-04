import { describe, expect, it, afterEach } from "vitest";
import type { Request } from "express";
import {
  COOKIE_NAME,
  PRODUCTION_COOKIE_NAME,
} from "@shared/const";
import {
  getSessionCookieName,
  getSessionCookieNamesToClear,
  getSessionCookieOptions,
} from "./cookies";

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;
});

function request(
  protocol: string,
  forwardedProto?: string
): Request {
  return {
    protocol,
    headers: forwardedProto
      ? { "x-forwarded-proto": forwardedProto }
      : {},
  } as Request;
}

describe("session cookie transport", () => {
  it("always sets Secure in production", () => {
    process.env.NODE_ENV = "production";

    expect(getSessionCookieOptions(request("http"))).toMatchObject({
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
    });
  });

  it("allows HTTP localhost-style development while honoring forwarded HTTPS", () => {
    process.env.NODE_ENV = "development";

    expect(getSessionCookieOptions(request("http")).secure).toBe(false);
    expect(
      getSessionCookieOptions(request("http", "http, https")).secure
    ).toBe(true);
    expect(getSessionCookieOptions(request("https")).secure).toBe(true);
  });
});


describe("session cookie naming", () => {
  it("uses a __Host- cookie in production", () => {
    expect(
      getSessionCookieName({
        NODE_ENV: "production",
      } as NodeJS.ProcessEnv)
    ).toBe(PRODUCTION_COOKIE_NAME);
    expect(PRODUCTION_COOKIE_NAME.startsWith("__Host-")).toBe(true);
  });

  it("preserves the local cookie name outside production", () => {
    expect(
      getSessionCookieName({
        NODE_ENV: "development",
      } as NodeJS.ProcessEnv)
    ).toBe(COOKIE_NAME);
  });

  it("clears both production and legacy names during migration", () => {
    expect(
      getSessionCookieNamesToClear({
        NODE_ENV: "production",
      } as NodeJS.ProcessEnv)
    ).toEqual([
      PRODUCTION_COOKIE_NAME,
      COOKIE_NAME,
    ]);
  });

  it("clears only the active local name outside production", () => {
    expect(
      getSessionCookieNamesToClear({
        NODE_ENV: "test",
      } as NodeJS.ProcessEnv)
    ).toEqual([COOKIE_NAME]);
  });
});
