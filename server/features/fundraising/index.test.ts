import { describe, expect, it } from "vitest";
import { completionPercent, evaluateContribution, validateCampaign } from "./index";

const campaign = {
  id: "camp-1",
  title: "Community lab",
  goalMinor: 100_00,
  raisedMinor: 25_00,
  currency: "USD",
  status: "active" as const,
};

describe("SkyFundraising", () => {
  it("accepts a valid contribution intent deterministically", () => {
    expect(evaluateContribution(campaign, {
      campaignId: "camp-1",
      contributorId: "user-1",
      amountMinor: 10_00,
      currency: "USD",
      idempotencyKey: "idem-1",
    })).toEqual({ accepted: true, projectedRaisedMinor: 35_00 });
  });

  it("rejects non-active campaigns", () => {
    expect(evaluateContribution({ ...campaign, status: "paused" }, {
      campaignId: "camp-1",
      contributorId: "user-1",
      amountMinor: 100,
      currency: "USD",
      idempotencyKey: "idem-2",
    }).reason).toBe("campaign-not-active");
  });

  it("rejects currency mismatch and invalid amounts", () => {
    expect(evaluateContribution(campaign, {
      campaignId: "camp-1",
      contributorId: "user-1",
      amountMinor: 100,
      currency: "EUR",
      idempotencyKey: "idem-3",
    }).reason).toBe("currency-mismatch");
    expect(evaluateContribution(campaign, {
      campaignId: "camp-1",
      contributorId: "user-1",
      amountMinor: 0,
      currency: "USD",
      idempotencyKey: "idem-4",
    }).reason).toBe("invalid-amount");
  });

  it("computes bounded completion percentage", () => {
    expect(completionPercent(campaign)).toBe(25);
    expect(completionPercent({ ...campaign, raisedMinor: 150_00 })).toBe(100);
  });

  it("validates campaign money and currency invariants", () => {
    expect(validateCampaign({ ...campaign, goalMinor: 0, currency: "usd" })).toEqual([
      "goalMinor must be a positive safe integer",
      "currency must be a 3-letter uppercase code",
    ]);
  });
});
