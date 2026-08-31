import { describe, expect, it } from "vitest";
import { isEntitled } from "./index";

describe("SkyEntitlements", () => {
  it("matches active grants exactly", () => {
    const grants = [{ subjectId: "user:1", resource: "course:7", action: "read", expiresAtMs: 2_000 }];
    expect(isEntitled({ subjectId: "user:1", resource: "course:7", action: "read", nowMs: 1_000 }, grants)).toBe(true);
    expect(isEntitled({ subjectId: "user:1", resource: "course:7", action: "write", nowMs: 1_000 }, grants)).toBe(false);
  });

  it("rejects expired grants", () => {
    expect(isEntitled({ subjectId: "user:1", resource: "course:7", action: "read", nowMs: 2_000 }, [{ subjectId: "user:1", resource: "course:7", action: "read", expiresAtMs: 2_000 }])).toBe(false);
  });

  it("fails closed on invalid clock input", () => {
    expect(() => isEntitled({ subjectId: "user:1", resource: "course:7", action: "read", nowMs: Number.NaN }, [])).toThrow("invalid nowMs");
  });
});
