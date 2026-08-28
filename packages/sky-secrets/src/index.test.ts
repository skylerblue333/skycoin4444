import { describe, expect, it } from "vitest";
import {
  createSecretAccessEvent,
  normalizeSecretReference,
  redactSecretValue,
  secretReferenceKey,
} from "./index";

describe("SkySecrets", () => {
  it("normalizes references and derives deterministic keys", () => {
    const reference = normalizeSecretReference({ namespace: " core ", name: "api-key", version: "v1" });
    expect(reference).toEqual({ namespace: "core", name: "api-key", version: "v1" });
    expect(secretReferenceKey(reference)).toBe("core:api-key:v1");
  });

  it("creates metadata-only access events", () => {
    const event = createSecretAccessEvent({
      actorId: "svc-auth",
      purpose: "sign session metadata",
      reference: { namespace: "auth", name: "signing-key" },
    });
    expect(event.type).toBe("sky.secrets.access.requested.v1");
    expect(event.referenceKey).toBe("auth:signing-key:latest");
    expect(event).not.toHaveProperty("value");
  });

  it("rejects unsafe references and redacts obvious secret-bearing fields", () => {
    expect(() => secretReferenceKey({ namespace: "../escape", name: "key" })).toThrow();
    expect(redactSecretValue({ value: "abc", token: "xyz", owner: "svc" })).toEqual({
      value: "[REDACTED]",
      token: "[REDACTED]",
      owner: "svc",
    });
  });
});
