import { describe, expect, it } from "vitest";
import { SKYHOPE_CAMPAIGNS } from "./charity";

describe("SkyHope campaign catalog", () => {
  it("uses a bounded reviewed campaign catalog with no settlement claims", () => {
    expect(SKYHOPE_CAMPAIGNS).toHaveLength(3);
    expect(new Set(SKYHOPE_CAMPAIGNS.map(campaign => campaign.id)).size).toBe(3);
    for (const campaign of SKYHOPE_CAMPAIGNS) {
      expect(campaign.status).toBe("active");
      expect(campaign.currency).toBe("USD");
      expect(campaign.goalMinor).toBeGreaterThan(0);
      expect(campaign.beneficiaryLabel).toMatch(/initiatives/i);
    }
  });
});
