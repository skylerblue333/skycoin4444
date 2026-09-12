import { scryptSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  betaAccessKeyIssue,
  betaAccessOpenId,
  betaAuthMode,
  betaAuthModeIssue,
  normalizeBetaEmail,
  oauthProviderRuntimeEnabled,
  verifyBetaAccessKey,
} from "./betaAccessAuth";

const strongKey = "A".repeat(48);

describe("beta access-key authentication policy", () => {
  it("defaults to oauth and accepts explicit access_key mode", () => {
    expect(betaAuthMode({} as NodeJS.ProcessEnv)).toBe("oauth");
    expect(
      betaAuthMode({
        VITE_BETA_AUTH_MODE: "access_key",
      } as NodeJS.ProcessEnv)
    ).toBe("access_key");
  });

  it("enables the external OAuth runtime only in oauth mode", () => {
    expect(oauthProviderRuntimeEnabled({} as NodeJS.ProcessEnv)).toBe(true);
    expect(
      oauthProviderRuntimeEnabled({
        VITE_BETA_AUTH_MODE: "oauth",
      } as NodeJS.ProcessEnv)
    ).toBe(true);
    expect(
      oauthProviderRuntimeEnabled({
        VITE_BETA_AUTH_MODE: "access_key",
      } as NodeJS.ProcessEnv)
    ).toBe(false);
  });

  it("rejects unknown auth modes", () => {
    expect(
      betaAuthModeIssue({
        VITE_BETA_AUTH_MODE: "password",
      } as NodeJS.ProcessEnv)
    ).toMatch(/oauth or access_key/);
  });

  it("requires a long server-side access key", () => {
    expect(
      betaAccessKeyIssue({
        VITE_BETA_AUTH_MODE: "access_key",
        BETA_ACCESS_KEY: "too-short",
      } as NodeJS.ProcessEnv)
    ).toMatch(/48 bytes/);

    expect(
      betaAccessKeyIssue({
        VITE_BETA_AUTH_MODE: "access_key",
        BETA_ACCESS_KEY: strongKey,
      } as NodeJS.ProcessEnv)
    ).toBeNull();
  });

  it("verifies access keys without exposing the configured value", () => {
    const env = {
      VITE_BETA_AUTH_MODE: "access_key",
      BETA_ACCESS_KEY: strongKey,
    } as NodeJS.ProcessEnv;

    expect(verifyBetaAccessKey(strongKey, env)).toBe(true);
    expect(verifyBetaAccessKey("B".repeat(48), env)).toBe(false);
  });

  it("verifies a beta password against a server-side scrypt credential", () => {
    const salt = Buffer.from("00112233445566778899aabbccddeeff", "hex");
    const password = "short-beta-password";
    const passwordCredential =
      salt.toString("hex") +
      ":" +
      scryptSync(password, salt, 32).toString("hex");
    const env = {
      VITE_BETA_AUTH_MODE: "access_key",
      BETA_ACCESS_PASSWORD_SCRYPT: passwordCredential,
    } as NodeJS.ProcessEnv;

    expect(betaAccessKeyIssue(env)).toBeNull();
    expect(verifyBetaAccessKey(password, env)).toBe(true);
    expect(verifyBetaAccessKey("wrong-password", env)).toBe(false);
  });

  it("normalizes invited emails and derives a stable opaque session identity", () => {
    expect(normalizeBetaEmail(" Tester@Example.COM ")).toBe(
      "tester@example.com"
    );
    expect(normalizeBetaEmail("not-an-email")).toBeNull();

    const first = betaAccessOpenId("tester@example.com");
    const second = betaAccessOpenId("Tester@Example.com");
    expect(first).toBe(second);
    expect(first).toMatch(/^beta_email_[a-f0-9]{40}$/);
    expect(first).not.toContain("tester");
  });
});
