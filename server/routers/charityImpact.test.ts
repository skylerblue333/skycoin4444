import { describe, expect, it } from "vitest";
import {
  CHARITY_FINANCE_ACTIONS,
  SKYHOPE_IMPACT_MISSIONS,
  charityFinanceInputSchema,
} from "./charityImpact";
import { evaluateCharityGamingFinance } from "../features/charity-gaming-finance";

describe("SkyHope impact router contracts", () => {
  it("publishes concrete cross-product mission paths without financial claims", () => {
    expect(SKYHOPE_IMPACT_MISSIONS.length).toBeGreaterThanOrEqual(4);
    for (const mission of SKYHOPE_IMPACT_MISSIONS) {
      expect(mission.learningRoute).toMatch(/^\//);
      expect(mission.coachRoute).toBe("/hope-a-i");
      expect(mission.practiceRoute).toMatch(/^\//);
      expect(mission.evidence.toLowerCase()).not.toContain("guaranteed donation");
    }
  });

  it("keeps every real-value action inside the existing fail-closed policy", () => {
    expect(CHARITY_FINANCE_ACTIONS).toContain("deposit");
    expect(CHARITY_FINANCE_ACTIONS).toContain("real-money-wager");
    expect(CHARITY_FINANCE_ACTIONS).toContain("token-settlement");

    const input = charityFinanceInputSchema.parse({
      action: "token-settlement",
      beneficiaryId: "charity:demo:001",
      beneficiaryVerified: true,
      charityOnly: true,
      paymentProviderApproved: false,
      legalReviewApproved: true,
      regionAllowed: true,
      ageGatePassed: true,
      regulatedGamingProviderApproved: true,
    });

    expect(evaluateCharityGamingFinance(input.action, input)).toMatchObject({
      allowed: false,
      reason: "payment-provider-not-approved",
      executeExternally: true,
    });
  });

  it("requires the extra regulated-gaming gates for real-money wagering", () => {
    const input = charityFinanceInputSchema.parse({
      action: "real-money-wager",
      beneficiaryId: "charity:demo:002",
      beneficiaryVerified: true,
      charityOnly: true,
      paymentProviderApproved: true,
      legalReviewApproved: true,
      regionAllowed: true,
      ageGatePassed: false,
      regulatedGamingProviderApproved: true,
    });

    expect(evaluateCharityGamingFinance(input.action, input)).toMatchObject({
      allowed: false,
      reason: "age-gate-required",
    });
  });
});
