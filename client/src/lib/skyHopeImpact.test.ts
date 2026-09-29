import { describe, expect, it } from "vitest";
import {
  buildSkyHopeImpactPlan,
  SKYHOPE_IMPACT_BOUNDARY,
} from "./skyHopeImpact";

const input = {
  title: "Community learning access",
  theme: "education" as const,
  beneficiaryGoal: 120,
  objective: "Provide a measurable learning-access pilot with explicit consent.",
  evidenceMetric: "Completed learning sessions with anonymized attendance evidence.",
};

describe("SkyHope impact planning", () => {
  it("builds a deterministic evidence-first plan", () => {
    const first = buildSkyHopeImpactPlan(input);
    const second = buildSkyHopeImpactPlan(input);

    expect(first).toEqual(second);
    expect(first.contract).toBe("skyhope.impact-plan.v1");
    expect(first.milestones.map(item => item.beneficiaryTarget)).toEqual([
      30,
      60,
      90,
      120,
    ]);
    expect(first.hopeAiBrief).toContain("Do not claim a charity is verified");
  });

  it("rejects malformed goals and empty evidence", () => {
    expect(() =>
      buildSkyHopeImpactPlan({ ...input, beneficiaryGoal: 0 }),
    ).toThrow(RangeError);
    expect(() =>
      buildSkyHopeImpactPlan({ ...input, evidenceMetric: "   " }),
    ).toThrow(TypeError);
  });

  it("keeps planning separate from payments, custody, verification, and chain writes", () => {
    expect(SKYHOPE_IMPACT_BOUNDARY.executesPayments).toBe(false);
    expect(SKYHOPE_IMPACT_BOUNDARY.acceptsCustody).toBe(false);
    expect(SKYHOPE_IMPACT_BOUNDARY.verifiesBeneficiaries).toBe(false);
    expect(SKYHOPE_IMPACT_BOUNDARY.writesBlockchainTransactions).toBe(false);
    expect(SKYHOPE_IMPACT_BOUNDARY.durableServerCampaignStore).toBe(false);
  });
});
