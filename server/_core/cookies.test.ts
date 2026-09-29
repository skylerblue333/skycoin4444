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

    const options = getSessionCookieOptions(request("http"));
    expect(options).toMatchObject({
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
    });
    expect(options.domain).toBeUndefined();
  });

  it("uses Lax for local HTTP and None only when the cookie is Secure", () => {
    process.env.NODE_ENV = "development";

    expect(getSessionCookieOptions(request("http"))).toMatchObject({
      secure: false,
      sameSite: "lax",
    });
    expect(
      getSessionCookieOptions(request("http", "http, https"))
    ).toMatchObject({
      secure: true,
      sameSite: "none",
    });
    expect(getSessionCookieOptions(request("https"))).toMatchObject({
      secure: true,
      sameSite: "none",
    });
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
