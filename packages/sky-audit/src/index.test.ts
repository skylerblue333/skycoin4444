import { describe, expect, it } from "vitest";
import { canonicalizeAudit, createAuditRecord, redactAuditMetadata } from "./index";

describe("SkyAudit", () => {
  const input = {
    actorId: " user-1 ",
    action: "login",
    resource: "session",
    occurredAt: "2026-08-25T12:00:00Z",
    metadata: { z: 2, a: 1 },
  };

  it("creates deterministic normalized records", () => {
    const first = createAuditRecord(input);
    const second = createAuditRecord(input);
    expect(first.id).toBe(second.id);
    expect(first.actorId).toBe("user-1");
    expect(first.occurredAt).toBe("2026-08-25T12:00:00.000Z");
  });

  it("hashes every UTF-16 unit so distinct astral actors do not collide", () => {
    const first = createAuditRecord({ ...input, actorId: "😀" });
    const second = createAuditRecord({ ...input, actorId: "😁" });
    expect(first.canonical).not.toBe(second.canonical);
    expect(first.id).not.toBe(second.id);
  });

  it("canonicalizes metadata with locale-independent code-unit ordering", () => {
    expect(canonicalizeAudit(input)).toContain('[["a",1],["z",2]]');
    expect(canonicalizeAudit({ ...input, metadata: { "ä": 2, z: 1 } })).toContain(
      '[["z",1],["ä",2]]',
    );
  });

  it("rejects non-finite metadata instead of canonicalizing it as null", () => {
    expect(() => canonicalizeAudit({ ...input, metadata: { score: Number.NaN } })).toThrow(
      /finite number/,
    );
    expect(() =>
      canonicalizeAudit({ ...input, metadata: { score: Number.POSITIVE_INFINITY } }),
    ).toThrow(/finite number/);
  });

  it("normalizes explicit offsets and accepts real proleptic-Gregorian leap dates", () => {
    expect(
      createAuditRecord({ ...input, occurredAt: "2026-08-25T07:00:00-05:00" }).occurredAt,
    ).toBe("2026-08-25T12:00:00.000Z");
    expect(
      createAuditRecord({ ...input, occurredAt: "0000-02-29T00:00:00Z" }).occurredAt,
    ).toBe("0000-02-29T00:00:00.000Z");
  });

  it("rejects impossible calendar dates and timestamps without an explicit zone", () => {
    expect(() =>
      createAuditRecord({ ...input, occurredAt: "2026-02-30T12:00:00Z" }),
    ).toThrow(/real ISO date-time/);
    expect(() =>
      createAuditRecord({ ...input, occurredAt: "2026-08-25T12:00:00" }),
    ).toThrow(/explicit UTC offset/);
    expect(() => createAuditRecord({ ...input, occurredAt: "invalid" })).toThrow();
  });

  it("redacts exact and composite sensitive metadata keys", () => {
    expect(
      redactAuditMetadata({
        token: "abc",
        Authorization: "Bearer secret",
        accessToken: "access",
        api_token: "api",
        clientSecret: "client",
        authorizationHeader: "header",
        ok: true,
      }),
    ).toEqual({
      token: "[REDACTED]",
      Authorization: "[REDACTED]",
      accessToken: "[REDACTED]",
      api_token: "[REDACTED]",
      clientSecret: "[REDACTED]",
      authorizationHeader: "[REDACTED]",
      ok: true,
    });
  });

  it("does not redact unrelated keys that merely contain similar letters", () => {
    expect(redactAuditMetadata({ tokenizerMode: "safe", secretary: "team" })).toEqual({
      tokenizerMode: "safe",
      secretary: "team",
    });
  });
});
