import { describe, expect, it } from "vitest";
import { COOKIE_NAME } from "@shared/const";
import { evaluateCookieMutationOrigin } from "./requestSecurity";

const cookie = `${COOKIE_NAME}=session-value`;

describe("cookie mutation origin policy", () => {
  it("does not apply CSRF origin policy to safe methods", () => {
    expect(
      evaluateCookieMutationOrigin(
        {
          method: "GET",
          cookieHeader: cookie,
          originHeader: "https://attacker.example",
        },
        { NODE_ENV: "production", BETA_PUBLIC_ORIGIN: "https://beta.example" } as NodeJS.ProcessEnv
      )
    ).toEqual({
      allowed: true,
      reason: "not_ambient_cookie_mutation",
    });
  });

  it("does not require browser origin checks for non-cookie bearer clients", () => {
    expect(
      evaluateCookieMutationOrigin(
        { method: "POST" },
        { NODE_ENV: "production", BETA_PUBLIC_ORIGIN: "https://beta.example" } as NodeJS.ProcessEnv
      )
    ).toEqual({
      allowed: true,
      reason: "not_ambient_cookie_mutation",
    });
  });

  it("accepts same-origin production cookie mutations", () => {
    expect(
      evaluateCookieMutationOrigin(
        {
          method: "POST",
          cookieHeader: cookie,
          originHeader: "https://beta.example",
          secFetchSite: "same-origin",
        },
        { NODE_ENV: "production", BETA_PUBLIC_ORIGIN: "https://beta.example" } as NodeJS.ProcessEnv
      )
    ).toEqual({ allowed: true, reason: "same_origin" });
  });

  it("rejects cross-site browser requests before origin comparison", () => {
    expect(
      evaluateCookieMutationOrigin(
        {
          method: "POST",
          cookieHeader: cookie,
          originHeader: "https://beta.example",
          secFetchSite: "cross-site",
        },
        { NODE_ENV: "production", BETA_PUBLIC_ORIGIN: "https://beta.example" } as NodeJS.ProcessEnv
      )
    ).toEqual({ allowed: false, reason: "cross_site_fetch" });
  });

  it("rejects missing or mismatched production origins", () => {
    const env = {
      NODE_ENV: "production",
      BETA_PUBLIC_ORIGIN: "https://beta.example",
    } as NodeJS.ProcessEnv;

    expect(
      evaluateCookieMutationOrigin(
        { method: "POST", cookieHeader: cookie },
        env
      )
    ).toEqual({ allowed: false, reason: "missing_origin" });

    expect(
      evaluateCookieMutationOrigin(
        {
          method: "POST",
          cookieHeader: cookie,
          originHeader: "https://evil.example",
        },
        env
      )
    ).toEqual({ allowed: false, reason: "origin_mismatch" });
  });

  it("fails closed when production public origin is unavailable", () => {
    expect(
      evaluateCookieMutationOrigin(
        {
          method: "POST",
          cookieHeader: cookie,
          originHeader: "https://beta.example",
        },
        { NODE_ENV: "production" } as NodeJS.ProcessEnv
      )
    ).toEqual({ allowed: false, reason: "missing_production_origin" });
  });

  it("allows origin-less local tooling only outside production", () => {
    expect(
      evaluateCookieMutationOrigin(
        {
          method: "POST",
          cookieHeader: cookie,
          requestOrigin: "http://localhost:3000",
        },
        { NODE_ENV: "development" } as NodeJS.ProcessEnv
      )
    ).toEqual({ allowed: true, reason: "development_no_origin" });
  });

  it("rejects malformed origins", () => {
    expect(
      evaluateCookieMutationOrigin(
        {
          method: "POST",
          cookieHeader: cookie,
          originHeader: "not a url",
        },
        {
          NODE_ENV: "production",
          BETA_PUBLIC_ORIGIN: "https://beta.example",
        } as NodeJS.ProcessEnv
      )
    ).toEqual({ allowed: false, reason: "invalid_origin" });
  });
});
