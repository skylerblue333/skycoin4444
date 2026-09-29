import { describe, expect, it } from "vitest";
import {
  getSkyHopeStats,
  listSkyHopeCampaigns,
  listSkyHopeVolunteerOpportunities,
  planSkyHopePledge,
  SKYHOPE_BETA_BOUNDARY,
} from "./index";

describe("SkyHope engineering-beta domain", () => {
  it("publishes only demonstration catalog records", () => {
    const campaigns = listSkyHopeCampaigns();
    expect(campaigns).toHaveLength(3);
    expect(campaigns.every(campaign => campaign.evidenceLevel === "demo-catalog")).toBe(true);
    expect(campaigns.every(campaign => campaign.currency === "USD")).toBe(true);

    const volunteers = listSkyHopeVolunteerOpportunities();
    expect(volunteers).toHaveLength(3);
    expect(volunteers.every(item => item.mode === "local-coordinator-required")).toBe(true);
  });

  it("creates a bounded pledge plan without executing or persisting money movement", () => {
    const plan = planSkyHopePledge({
      campaignId: "demo-food-kits",
      supporterId: "user-44",
      amountMinor: 2500,
      idempotencyKey: "pledge-intent-0001",
    });

    expect(plan.accepted).toBe(true);
    expect(plan.projectedPledgedMinor).toBe(877500);
    expect(plan.paymentCollected).toBe(false);
    expect(plan.donationPersisted).toBe(false);
    expect(plan.externalSettlementExecuted).toBe(false);
    expect(plan.blockchainTransactionBroadcast).toBe(false);
    expect(plan.providerRequiredForSettlement).toBe(true);
  });

  it("rejects unknown campaigns and invalid amounts", () => {
    expect(
      planSkyHopePledge({
        campaignId: "missing",
        supporterId: "user-44",
        amountMinor: 100,
        idempotencyKey: "pledge-intent-0002",
      }).reason,
    ).toBe("campaign-not-found");

    expect(
      planSkyHopePledge({
        campaignId: "demo-food-kits",
        supporterId: "user-44",
        amountMinor: 0,
        idempotencyKey: "pledge-intent-0003",
      }).reason,
    ).toBe("invalid-amount");
  });

  it("keeps stats and execution boundaries explicit", () => {
    const stats = getSkyHopeStats();
    expect(stats.catalogMode).toBe("demonstration");
    expect(stats.paymentExecutionEnabled).toBe(false);
    expect(stats.activeCampaigns).toBe(3);
    expect(SKYHOPE_BETA_BOUNDARY.executesPayments).toBe(false);
    expect(SKYHOPE_BETA_BOUNDARY.verifiesNonprofits).toBe(false);
    expect(SKYHOPE_BETA_BOUNDARY.provesExternalImpact).toBe(false);
  });
});
