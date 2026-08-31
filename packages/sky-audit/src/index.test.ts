import { describe, expect, it } from "vitest";
import { canonicalizeAudit, createAuditRecord, redactAuditMetadata } from "./index";

describe("SkyAudit", () => {
  const input = { actorId: " user-1 ", action: "login", resource: "session", occurredAt: "2026-08-25T12:00:00Z", metadata: { z: 2, a: 1 } };

  it("creates deterministic normalized records", () => {
    const first = createAuditRecord(input);
    const second = createAuditRecord(input);
    expect(first.id).toBe(second.id);
    expect(first.actorId).toBe("user-1");
    expect(first.occurredAt).toBe("2026-08-25T12:00:00.000Z");
  });

  it("canonicalizes metadata with locale-independent code-unit ordering", () => {
    expect(canonicalizeAudit(input)).toContain('[["a",1],["z",2]]');
    expect(canonicalizeAudit({ ...input, metadata: { "ä": 2, z: 1 } })).toContain('[["z",1],["ä",2]]');
  });

  it("normalizes explicit offsets but rejects impossible calendar dates and missing zones", () => {
    expect(createAuditRecord({ ...input, occurredAt: "2026-08-25T07:00:00-05:00" }).occurredAt).toBe("2026-08-25T12:00:00.000Z");
    expect(() => createAuditRecord({ ...input, occurredAt: "2026-02-30T12:00:00Z" })).toThrow(/real ISO date-time/);
    expect(() => createAuditRecord({ ...input, occurredAt: "2026-08-25T12:00:00" })).toThrow(/explicit UTC offset/);
    expect(() => createAuditRecord({ ...input, occurredAt: "invalid" })).toThrow();
  });

  it("redacts sensitive keys case-insensitively", () => {
    expect(redactAuditMetadata({ token: "abc", Authorization: "Bearer secret", ok: true })).toEqual({
      token: "[REDACTED]",
      Authorization: "[REDACTED]",
      ok: true,
    });
  });
});
