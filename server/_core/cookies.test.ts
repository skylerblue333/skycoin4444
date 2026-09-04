import { describe, expect, it, afterEach } from "vitest";
import type { Request } from "express";
import { getSessionCookieOptions } from "./cookies";

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
