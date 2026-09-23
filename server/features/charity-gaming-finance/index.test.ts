import { describe, expect, it } from "vitest";
import {
  CHARITY_GAMING_FINANCE_BOUNDARY,
  evaluateCharityGamingFinance,
  planCharityGamingFinance,
  type CharityFinanceContext,
} from "./index";

const compliantContext: CharityFinanceContext = {
  beneficiaryId: "charity:verified:001",
  beneficiaryVerified: true,
  charityOnly: true,
  paymentProviderApproved: true,
  legalReviewApproved: true,
  regionAllowed: true,
  ageGatePassed: true,
  regulatedGamingProviderApproved: true,
};

describe("charity gaming finance policy", () => {
  it("blocks finance without a verified charity beneficiary", () => {
    expect(
      evaluateCharityGamingFinance("deposit", {
        ...compliantContext,
        beneficiaryVerified: false,
      }),
    ).toMatchObject({ allowed: false, reason: "beneficiary-not-verified" });
  });

  it("blocks external-value actions when provider approval is missing", () => {
    expect(
      evaluateCharityGamingFinance("token-settlement", {
        ...compliantContext,
        paymentProviderApproved: false,
      }),
    ).toMatchObject({ allowed: false, reason: "payment-provider-not-approved" });
  });

  it("requires extra regulated-gaming gates for a real-money wager", () => {
    expect(
      evaluateCharityGamingFinance("real-money-wager", {
        ...compliantContext,
        ageGatePassed: false,
      }),
    ).toMatchObject({ allowed: false, reason: "age-gate-required" });

    expect(
      evaluateCharityGamingFinance("real-money-wager", {
        ...compliantContext,
        regulatedGamingProviderApproved: false,
      }),
    ).toMatchObject({
      allowed: false,
      reason: "regulated-gaming-provider-required",
    });
  });

  it("only creates an external handoff plan after all gates pass", () => {
    expect(planCharityGamingFinance("redeemable-crypto-reward", compliantContext)).toEqual({
      contract: "sky.charity-gaming.finance-plan.v1",
      action: "redeemable-crypto-reward",
      beneficiaryId: "charity:verified:001",
      executeExternally: true,
      custodyBySkycoin4444: false,
      blockchainBroadcastBySkycoin4444: false,
    });
  });

  it("documents that SKYCOIN4444 does not execute financial actions itself", () => {
    expect(CHARITY_GAMING_FINANCE_BOUNDARY.scope).toBe("charity-only");
    expect(CHARITY_GAMING_FINANCE_BOUNDARY.executesPayments).toBe(false);
    expect(CHARITY_GAMING_FINANCE_BOUNDARY.executesWagers).toBe(false);
    expect(CHARITY_GAMING_FINANCE_BOUNDARY.holdsCustody).toBe(false);
    expect(CHARITY_GAMING_FINANCE_BOUNDARY.broadcastsBlockchainTransactions).toBe(false);
  });
});
