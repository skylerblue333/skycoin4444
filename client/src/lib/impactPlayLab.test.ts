import { describe, expect, it } from "vitest";
import {
  evaluateImpactAllocation,
  IMPACT_PLAY_BOUNDARY,
  IMPACT_PLAY_RECOMMENDED,
} from "./impactPlayLab";

describe("Impact Play Lab", () => {
  it("rewards the balanced practice allocation deterministically", () => {
    expect(evaluateImpactAllocation(IMPACT_PLAY_RECOMMENDED)).toMatchObject({
      practiceScore: 100,
      missing: [],
    });
  });

  it("rejects allocations that do not total 100", () => {
    expect(() =>
      evaluateImpactAllocation({
        needs: 30,
        evidence: 25,
        delivery: 25,
        safeguards: 19,
      }),
    ).toThrow(/total exactly 100/);
  });

  it("never represents a practice score as money, tokens, donations, or impact prediction", () => {
    expect(IMPACT_PLAY_BOUNDARY.cashValue).toBe(false);
    expect(IMPACT_PLAY_BOUNDARY.tokenValue).toBe(false);
    expect(IMPACT_PLAY_BOUNDARY.triggersDonation).toBe(false);
    expect(IMPACT_PLAY_BOUNDARY.predictsRealWorldImpact).toBe(false);
  });
});
