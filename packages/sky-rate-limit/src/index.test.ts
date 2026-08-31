import { describe, expect, it } from "vitest";
import { evaluateRateLimit, validateRateLimitPolicy } from "./index";

const policy = { limit: 2, windowMs: 1_000 };

describe("SkyRateLimit", () => {
  it("allows below the limit and blocks at the limit", () => {
    const events = [
      { subjectId: "user:1", observedAtMs: 9_500 },
      { subjectId: "user:1", observedAtMs: 9_900 },
    ];
    expect(evaluateRateLimit("user:1", events.slice(0, 1), 10_000, policy)).toEqual({
      allowed: true,
      used: 1,
      remaining: 1,
      retryAfterMs: 0,
    });
    const blocked = evaluateRateLimit("user:1", events, 10_000, policy);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("ignores expired and other-subject events", () => {
    expect(
      evaluateRateLimit(
        "user:1",
        [
          { subjectId: "user:1", observedAtMs: 8_999 },
          { subjectId: "user:2", observedAtMs: 9_999 },
        ],
        10_000,
        policy
      ).used
    ).toBe(0);
  });

  it("fails closed on invalid policy and future events", () => {
    expect(() => validateRateLimitPolicy({ limit: 0, windowMs: 1_000 })).toThrow("invalid limit");
    expect(() =>
      evaluateRateLimit("user:1", [{ subjectId: "user:1", observedAtMs: 10_001 }], 10_000, policy)
    ).toThrow("future");
  });
});
