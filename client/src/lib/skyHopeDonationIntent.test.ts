import { describe, expect, it } from "vitest";
import {
  createSkyHopeDonationPreview,
  scoreDonationPlanningReadiness,
} from "./skyHopeDonationIntent";

describe("SkyHope donation planning preview", () => {
  it("normalizes a bounded local-only contribution preview", () => {
    expect(
      createSkyHopeDonationPreview({
        campaignId: "community-lab",
        contributorReference: "tester-44",
        amountMajor: 25.5,
        currency: "usd",
      })
    ).toEqual({
      campaignId: "community-lab",
      contributorReference: "tester-44",
      amountMajor: 25.5,
      amountMinor: 2550,
      currency: "USD",
      previewReference: "preview-community-lab-2550-usd",
      provenance: "deterministic-local-preview",
    });
  });

  it("rejects malformed, fractional-minor-unit, and oversized amounts", () => {
    expect(() =>
      createSkyHopeDonationPreview({
        campaignId: "community-lab",
        contributorReference: "tester-44",
        amountMajor: 1.001,
        currency: "USD",
      })
    ).toThrow(/2 decimal places/i);

    expect(() =>
      createSkyHopeDonationPreview({
        campaignId: "community-lab",
        contributorReference: "tester-44",
        amountMajor: 100_001,
        currency: "USD",
      })
    ).toThrow(/at most 100000/i);

    expect(() =>
      createSkyHopeDonationPreview({
        campaignId: "x",
        contributorReference: "",
        amountMajor: 25,
        currency: "US",
      })
    ).toThrow();
  });

  it("scores planning gates without claiming provider verification", () => {
    expect(
      scoreDonationPlanningReadiness({
        campaignReviewed: true,
        beneficiaryEvidenceReviewed: true,
        providerSelected: false,
        legalBoundaryReviewed: true,
        reconciliationPlanDefined: false,
      })
    ).toEqual({
      score: 60,
      readyCount: 3,
      totalCount: 5,
      missing: [
        "External donation/payment provider selected",
        "Receipt, settlement, and reconciliation plan defined",
      ],
    });
  });
});
