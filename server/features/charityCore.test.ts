import { describe, expect, it } from "vitest";
import {
  CHARITY_CAMPAIGNS,
  buildContributionPlan,
  getCharityStats,
} from "./charityCore";

describe("SkyHope charity engineering-beta core", () => {
  it("publishes planning campaigns with zero live money movement", () => {
    expect(CHARITY_CAMPAIGNS.length).toBeGreaterThanOrEqual(3);
    for (const campaign of CHARITY_CAMPAIGNS) {
      expect(campaign.demoOnly).toBe(true);
      expect(campaign.raisedAmount).toBe(0);
      expect(campaign.liveFundsMoved).toBe(false);
      expect(campaign.beneficiaryVerification).toBe("not_connected");
    }

    expect(getCharityStats()).toMatchObject({
      totalRaised: 0,
      totalDonors: 0,
      liveFundsRaised: 0,
      liveDonors: 0,
      executionEnabled: false,
      blockchainExecutionEnabled: false,
    });
  });

  it("builds a bounded non-executing contribution plan", () => {
    const plan = buildContributionPlan({
      campaignId: CHARITY_CAMPAIGNS[0].id,
      amount: 125.5,
      actorId: "user-123",
    });

    expect(plan).toMatchObject({
      amount: 125.5,
      currency: "USD",
      executionStatus: "not_executed",
      moneyMoved: false,
      blockchainWrite: false,
      custody: false,
      persistence: "request_only",
      requiresExternalProvider: true,
    });
    expect(plan.requirements.length).toBeGreaterThanOrEqual(5);
  });

  it("fails closed on unknown campaigns and unsafe amounts", () => {
    expect(() =>
      buildContributionPlan({
        campaignId: "missing",
        amount: 10,
        actorId: "user",
      }),
    ).toThrow(/unknown charity campaign/);

    expect(() =>
      buildContributionPlan({
        campaignId: CHARITY_CAMPAIGNS[0].id,
        amount: 100_001,
        actorId: "user",
      }),
    ).toThrow(/between 0 and 100000/);
  });
});
