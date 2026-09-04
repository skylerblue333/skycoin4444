import { describe, expect, it } from "vitest";
import {
  betaAdmissionSnapshot,
  evaluateBetaAdmission,
} from "./betaAdmission";
import { inspectProductionBetaConfig } from "./productionConfig";

describe("invitation beta admission", () => {
  it("denies an uninvited production identity by default", () => {
    expect(
      evaluateBetaAdmission(
        { openId: "person-1", email: "person@example.test" },
        { NODE_ENV: "production", BETA_ACCESS_MODE: "invite_only" }
      )
    ).toEqual({ allowed: false, reason: "not_invited" });
  });

  it("allows owner, open-id, and email invitations", () => {
    const env = {
      NODE_ENV: "production",
      BETA_ACCESS_MODE: "invite_only",
      OWNER_OPEN_ID: "owner-1",
      BETA_ALLOWED_OPEN_IDS: "person-2,person-3",
      BETA_ALLOWED_EMAILS: "friend@example.test,SECOND@example.test",
    };

    expect(evaluateBetaAdmission({ openId: "owner-1" }, env).reason).toBe(
      "owner"
    );
    expect(evaluateBetaAdmission({ openId: "person-2" }, env).reason).toBe(
      "open_id_allowlist"
    );
    expect(
      evaluateBetaAdmission(
        { openId: "other", email: "second@example.test" },
        env
      ).reason
    ).toBe("email_allowlist");
  });

  it("keeps open access and local-test bypass development-only", () => {
    expect(
      evaluateBetaAdmission(
        { openId: "person" },
        { NODE_ENV: "development", BETA_ACCESS_MODE: "open" }
      )
    ).toEqual({ allowed: true, reason: "development_open" });

    expect(
      evaluateBetaAdmission(
        { openId: "local-test-user" },
        { NODE_ENV: "development", LOCAL_TEST_MODE: "true" }
      )
    ).toEqual({ allowed: true, reason: "local_test" });

    expect(
      evaluateBetaAdmission(
        { openId: "person" },
        { NODE_ENV: "production", BETA_ACCESS_MODE: "open" }
      ).allowed
    ).toBe(false);
  });

  it("reports admission configuration without exposing invite values", () => {
    expect(
      betaAdmissionSnapshot({
        NODE_ENV: "production",
        BETA_ALLOWED_EMAILS: "one@example.test,two@example.test",
        BETA_ALLOWED_OPEN_IDS: "oid-1",
      })
    ).toEqual({
      mode: "invite_only",
      configured: true,
      allowedEmailCount: 2,
      allowedOpenIdCount: 1,
      ownerConfigured: false,
      localTestBypassEnabled: false,
    });
  });
});

describe("production beta configuration", () => {
  const valid = {
    NODE_ENV: "production",
    DATABASE_URL: "mysql://user:password@db.example.test:3306/skycoin_beta",
    JWT_SECRET: "0123456789abcdef0123456789abcdef",
    VITE_APP_ID: "skycoin-beta",
    OAUTH_SERVER_URL: "https://oauth.example.test",
    VITE_OAUTH_PORTAL_URL: "https://portal.example.test",
    BETA_PUBLIC_ORIGIN: "https://beta.example.test",
    BETA_ACCESS_MODE: "invite_only",
    BETA_ALLOWED_EMAILS: "tester@example.test",
    LOCAL_TEST_MODE: "false",
  };

  it("accepts a fully configured invitation-only runtime", () => {
    expect(inspectProductionBetaConfig(valid)).toEqual([]);
  });

  it("rejects localhost databases, open production access, and missing invites", () => {
    const issues = inspectProductionBetaConfig({
      ...valid,
      DATABASE_URL: "mysql://user:password@localhost:3306/skycoin_beta",
      BETA_ACCESS_MODE: "open",
      BETA_ALLOWED_EMAILS: "",
    });
    const keys = issues.map(issue => issue.key);
    expect(keys).toContain("DATABASE_URL");
    expect(keys).toContain("BETA_ACCESS_MODE");
    expect(keys).toContain(
      "BETA_ALLOWED_EMAILS/BETA_ALLOWED_OPEN_IDS/OWNER_OPEN_ID"
    );
  });

  it("rejects weak sessions, insecure provider URLs, and local-test mode", () => {
    const issues = inspectProductionBetaConfig({
      ...valid,
      JWT_SECRET: "short",
      OAUTH_SERVER_URL: "http://oauth.example.test",
      VITE_OAUTH_PORTAL_URL: "not-a-url",
      BETA_PUBLIC_ORIGIN: "http://beta.example.test/path",
      LOCAL_TEST_MODE: "true",
    });
    const keys = new Set(issues.map(issue => issue.key));
    expect(keys.has("JWT_SECRET")).toBe(true);
    expect(keys.has("OAUTH_SERVER_URL")).toBe(true);
    expect(keys.has("VITE_OAUTH_PORTAL_URL")).toBe(true);
    expect(keys.has("BETA_PUBLIC_ORIGIN")).toBe(true);
    expect(keys.has("LOCAL_TEST_MODE")).toBe(true);
  });
});
