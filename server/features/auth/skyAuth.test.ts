import { describe, expect, it } from "vitest";
import { authenticateVerifiedSession, skyAuthPolicy } from "./skyAuth";

const now = 1_800_000_000_000;

function validClaims() {
  return {
    subject: "user:123",
    sessionId: "sess_abc-123",
    issuedAtMs: now - 60_000,
    expiresAtMs: now + 60_000,
    authMethod: "oauth" as const,
  };
}

describe("authenticateVerifiedSession", () => {
  it("creates a principal from upstream-verified claims", () => {
    const result = authenticateVerifiedSession(validClaims(), now);
    expect(result).toEqual({
      ok: true,
      principal: {
        subject: "user:123",
        sessionId: "sess_abc-123",
        authMethod: "oauth",
        authenticatedAtMs: now - 60_000,
        expiresAtMs: now + 60_000,
      },
    });
  });

  it("rejects expired sessions", () => {
    const result = authenticateVerifiedSession({ ...validClaims(), expiresAtMs: now }, now);
    expect(result).toMatchObject({ ok: false, code: "expired" });
  });

  it("rejects unsupported auth methods and unsafe identifiers", () => {
    expect(authenticateVerifiedSession({ ...validClaims(), authMethod: "magic" }, now)).toMatchObject({
      ok: false,
      code: "invalid_claims",
    });
    expect(authenticateVerifiedSession({ ...validClaims(), subject: "<script>" }, now)).toMatchObject({
      ok: false,
      code: "invalid_claims",
    });
  });

  it("rejects sessions issued beyond clock-skew tolerance", () => {
    const result = authenticateVerifiedSession(
      { ...validClaims(), issuedAtMs: now + skyAuthPolicy.maxClockSkewMs + 1, expiresAtMs: now + skyAuthPolicy.maxClockSkewMs + 60_000 },
      now,
    );
    expect(result).toMatchObject({ ok: false, code: "not_yet_valid" });
  });

  it("rejects excessive lifetimes", () => {
    const result = authenticateVerifiedSession(
      { ...validClaims(), issuedAtMs: now, expiresAtMs: now + skyAuthPolicy.maxSessionLifetimeMs + 1 },
      now,
    );
    expect(result).toMatchObject({ ok: false, code: "invalid_claims" });
  });
});
