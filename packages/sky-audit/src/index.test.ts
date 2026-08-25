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

  it("canonicalizes metadata deterministically", () => {
    expect(canonicalizeAudit(input)).toContain('[["a",1],["z",2]]');
  });

  it("rejects invalid dates and redacts sensitive keys", () => {
    expect(() => createAuditRecord({ ...input, occurredAt: "invalid" })).toThrow();
    expect(redactAuditMetadata({ token: "abc", ok: true })).toEqual({ token: "[REDACTED]", ok: true });
  });
});
