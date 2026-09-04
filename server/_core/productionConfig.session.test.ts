import { describe, expect, it } from "vitest";
import { inspectProductionBetaConfig } from "./productionConfig";

const validProductionEnv = {
  NODE_ENV: "production",
  DATABASE_URL: "mysql://user:pass@db.example:3306/skycoin4444_beta",
  JWT_SECRET: "12345678901234567890123456789012",
  VITE_APP_ID: "skycoin4444-beta",
  OAUTH_SERVER_URL: "https://oauth.example",
  VITE_OAUTH_PORTAL_URL: "https://portal.example",
  BETA_PUBLIC_ORIGIN: "https://beta.example",
  BETA_ACCESS_MODE: "invite_only",
  OWNER_OPEN_ID: "owner-1",
  BETA_ALLOWED_EMAILS: "",
  BETA_ALLOWED_OPEN_IDS: "",
  LOCAL_TEST_MODE: "false",
  SESSION_TTL_MS: "604800000",
} as NodeJS.ProcessEnv;

describe("production session lifetime configuration", () => {
  it("accepts the bounded seven-day session policy", () => {
    const issues = inspectProductionBetaConfig(validProductionEnv);

    expect(
      issues.find(issue => issue.key === "SESSION_TTL_MS")
    ).toBeUndefined();
  });

  it("fails production configuration for an excessive session lifetime", () => {
    const issues = inspectProductionBetaConfig({
      ...validProductionEnv,
      SESSION_TTL_MS: "31536000000",
    });

    expect(
      issues.find(issue => issue.key === "SESSION_TTL_MS")
    ).toMatchObject({
      key: "SESSION_TTL_MS",
    });
  });

  it("fails production configuration for non-decimal session syntax", () => {
    const issues = inspectProductionBetaConfig({
      ...validProductionEnv,
      SESSION_TTL_MS: "9e5",
    });

    expect(
      issues.find(issue => issue.key === "SESSION_TTL_MS")
    ).toMatchObject({
      key: "SESSION_TTL_MS",
    });
  });
});
