import { describe, expect, it } from "vitest";
import { inspectProductionBetaConfig } from "./productionConfig";

const baseEnv = {
  NODE_ENV: "production",
  DATABASE_URL: "mysql://user:pass@db.example:3306/skycoin4444_beta",
  JWT_SECRET: "12345678901234567890123456789012",
  VITE_APP_ID: "skycoin4444-beta",
  BETA_PUBLIC_ORIGIN: "https://beta.example",
  BETA_ACCESS_MODE: "invite_only",
  BETA_ALLOWED_EMAILS: "tester@example.com",
  BETA_ALLOWED_OPEN_IDS: "",
  OWNER_OPEN_ID: "",
  LOCAL_TEST_MODE: "false",
  SESSION_TTL_MS: "604800000",
} as NodeJS.ProcessEnv;

describe("production beta authentication mode", () => {
  it("accepts access_key mode without OAuth provider URLs", () => {
    const issues = inspectProductionBetaConfig({
      ...baseEnv,
      VITE_BETA_AUTH_MODE: "access_key",
      BETA_ACCESS_KEY: "A".repeat(48),
      OAUTH_SERVER_URL: "",
      VITE_OAUTH_PORTAL_URL: "",
    });

    expect(issues).toEqual([]);
  });

  it("accepts the explicit Railway client-IP header for access-key limiting", () => {
    const issues = inspectProductionBetaConfig({
      ...baseEnv,
      VITE_BETA_AUTH_MODE: "access_key",
      BETA_ACCESS_KEY: "A".repeat(48),
      BETA_TRUSTED_CLIENT_IP_HEADER: "x-real-ip",
    });

    expect(issues).toEqual([]);
  });

  it("fails closed on an untrusted client-IP header name", () => {
    const issues = inspectProductionBetaConfig({
      ...baseEnv,
      VITE_BETA_AUTH_MODE: "access_key",
      BETA_ACCESS_KEY: "A".repeat(48),
      BETA_TRUSTED_CLIENT_IP_HEADER: "x-forwarded-for",
    });

    expect(
      issues.find(
        issue => issue.key === "BETA_TRUSTED_CLIENT_IP_HEADER"
      )
    ).toMatchObject({
      key: "BETA_TRUSTED_CLIENT_IP_HEADER",
    });
  });

  it("fails closed on a weak access key", () => {
    const issues = inspectProductionBetaConfig({
      ...baseEnv,
      VITE_BETA_AUTH_MODE: "access_key",
      BETA_ACCESS_KEY: "too-short",
    });

    expect(
      issues.find(issue => issue.key === "BETA_ACCESS_KEY")
    ).toMatchObject({ key: "BETA_ACCESS_KEY" });
  });

  it("preserves OAuth requirements when oauth mode is selected", () => {
    const issues = inspectProductionBetaConfig({
      ...baseEnv,
      VITE_BETA_AUTH_MODE: "oauth",
      OAUTH_SERVER_URL: "",
      VITE_OAUTH_PORTAL_URL: "",
    });

    expect(issues.map(issue => issue.key)).toEqual(
      expect.arrayContaining([
        "OAUTH_SERVER_URL",
        "VITE_OAUTH_PORTAL_URL",
      ])
    );
  });

  it("rejects unknown authentication modes", () => {
    const issues = inspectProductionBetaConfig({
      ...baseEnv,
      VITE_BETA_AUTH_MODE: "password",
      OAUTH_SERVER_URL: "https://oauth.example",
      VITE_OAUTH_PORTAL_URL: "https://portal.example",
    });

    expect(
      issues.find(issue => issue.key === "VITE_BETA_AUTH_MODE")
    ).toMatchObject({ key: "VITE_BETA_AUTH_MODE" });
  });
});
