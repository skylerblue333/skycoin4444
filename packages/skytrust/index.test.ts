import { describe, expect, it } from "vitest";
import { assessTrust, SKY_TRUST_CONTRACT } from "./index";

const now = "2026-08-28T20:00:00Z";

describe("SkyTrust", () => {
  it("produces a deterministic bounded assessment", () => {
    const result = assessTrust([
      { subjectId: "acct-1", source: "profile", score: 80, observedAt: now },
      { subjectId: "acct-1", source: "ledger", score: 100, observedAt: now },
    ], now);
    expect(result).toEqual({ subjectId: "acct-1", score: 90, confidence: 0.67, signalCount: 2, assessedAt: now });
    expect(SKY_TRUST_CONTRACT).toBe("sky.trust.assessed.v1");
  });

  it("rejects invalid or mixed-subject signals", () => {
    expect(() => assessTrust([{ subjectId: "a", source: "x", score: 101, observedAt: now }], now)).toThrow();
    expect(() => assessTrust([
      { subjectId: "a", source: "x", score: 50, observedAt: now },
      { subjectId: "b", source: "y", score: 50, observedAt: now },
    ], now)).toThrow("same subject");
  });

  it("rejects impossible and future timestamps", () => {
    expect(() => assessTrust([{ subjectId: "a", source: "x", score: 50, observedAt: "2026-02-30T00:00:00Z" }], now)).toThrow("observedAt is invalid");
    expect(() => assessTrust([{ subjectId: "a", source: "x", score: 50, observedAt: "2026-08-28T20:00:01Z" }], now)).toThrow("after assessedAt");
    expect(() => assessTrust([{ subjectId: "a", source: "x", score: 50, observedAt: now }], "2026-02-30T00:00:00Z")).toThrow("assessedAt is invalid");
  });
});
