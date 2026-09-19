import { describe, expect, it } from "vitest";
import {
  completionPercent,
  evaluateContribution,
  validateCampaign,
} from "./index";

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
    expect(
      evaluateContribution(campaign, {
        campaignId: "camp-1",
        contributorId: "user-1",
        amountMinor: 10_00,
        currency: "USD",
        idempotencyKey: "idem-1",
      }),
    ).toEqual({ accepted: true, projectedRaisedMinor: 35_00 });
  });

  it("rejects non-active campaigns", () => {
    expect(
      evaluateContribution(
        { ...campaign, status: "paused" },
        {
          campaignId: "camp-1",
          contributorId: "user-1",
          amountMinor: 100,
          currency: "USD",
          idempotencyKey: "idem-2",
        },
      ).reason,
    ).toBe("campaign-not-active");
  });

  it("rejects currency mismatch and invalid amounts", () => {
    expect(
      evaluateContribution(campaign, {
        campaignId: "camp-1",
        contributorId: "user-1",
        amountMinor: 100,
        currency: "EUR",
        idempotencyKey: "idem-3",
      }).reason,
    ).toBe("currency-mismatch");
    expect(
      evaluateContribution(campaign, {
        campaignId: "camp-1",
        contributorId: "user-1",
        amountMinor: 0,
        currency: "USD",
        idempotencyKey: "idem-4",
      }).reason,
    ).toBe("invalid-amount");
  });

  it("rejects blank contributor identifiers", () => {
    expect(
      evaluateContribution(campaign, {
        campaignId: "camp-1",
        contributorId: "   ",
        amountMinor: 100,
        currency: "USD",
        idempotencyKey: "idem-5",
      }).reason,
    ).toBe("contributor-id-required");
  });

  it("rejects invalid campaign money before projecting a contribution", () => {
    expect(
      evaluateContribution(
        { ...campaign, raisedMinor: -1 },
        {
          campaignId: "camp-1",
          contributorId: "user-1",
          amountMinor: 100,
          currency: "USD",
          idempotencyKey: "idem-6",
        },
      ),
    ).toEqual({
      accepted: false,
      reason: "invalid-campaign",
      projectedRaisedMinor: 0,
    });
  });

  it("handles malformed runtime campaign strings without throwing", () => {
    expect(
      validateCampaign({
        ...campaign,
        id: null as unknown as string,
        title: 42 as unknown as string,
      }),
    ).toEqual(["id is required", "title is required"]);
  });

  it("handles malformed runtime contribution identifiers without throwing", () => {
    expect(
      evaluateContribution(campaign, {
        campaignId: "camp-1",
        contributorId: null as unknown as string,
        amountMinor: 100,
        currency: "USD",
        idempotencyKey: "idem-malformed",
      }).reason,
    ).toBe("contributor-id-required");

    expect(
      evaluateContribution(campaign, {
        campaignId: "camp-1",
        contributorId: "user-1",
        amountMinor: 100,
        currency: "USD",
        idempotencyKey: null as unknown as string,
      }).reason,
    ).toBe("idempotency-key-required");
  });

  it("computes bounded completion percentage", () => {
    expect(completionPercent(campaign)).toBe(25);
    expect(completionPercent({ ...campaign, raisedMinor: 150_00 })).toBe(100);
    expect(completionPercent({ ...campaign, raisedMinor: -1 })).toBe(0);
  });

  it("validates campaign money, currency, and lifecycle invariants", () => {
    expect(
      validateCampaign({
        ...campaign,
        goalMinor: 0,
        currency: "usd",
        status: "unknown" as "active",
      }),
    ).toEqual([
      "goalMinor must be a positive safe integer",
      "currency must be a 3-letter uppercase code",
      "status is invalid",
    ]);
  });
});
