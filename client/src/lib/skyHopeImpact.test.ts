import { describe, expect, it } from "vitest";
import {
  buildImpactPlan,
  getImpactProgram,
  impactPlanToText,
  normalizeImpactCommitment,
} from "./skyHopeImpact";

describe("SkyHope impact planning", () => {
  it("normalizes untrusted browser state into bounded commitments", () => {
    expect(
      normalizeImpactCommitment({
        programId: "learning-access",
        volunteerHours: "500",
        supplyKits: -4,
        focus: "  tutor one learner group  ",
      }),
    ).toEqual({
      programId: "learning-access",
      volunteerHours: 40,
      supplyKits: 0,
      focus: "tutor one learner group",
    });
  });

  it("falls back to a real packaged impact program for unknown ids", () => {
    expect(getImpactProgram("not-real").id).toBe("shelter-support");
  });

  it("builds a deterministic non-financial action plan with truth boundaries", () => {
    const plan = buildImpactPlan({
      programId: "community-tech",
      volunteerHours: 3,
      supplyKits: 2,
      focus: "help with basic device security",
    });

    expect(plan.contract).toBe("skyhope.impact-plan.v1");
    expect(plan.steps.join(" ")).toContain("3 volunteer hours");
    expect(plan.steps.join(" ")).toContain("2 supply kits");
    expect(plan.limitations.join(" ")).toContain("No payment");
    expect(impactPlanToText(plan)).not.toMatch(/donation confirmed|on-chain verified/i);
  });
});
