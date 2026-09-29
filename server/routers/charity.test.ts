import { describe, expect, it } from "vitest";
import { SKYHOPE_CAMPAIGNS, isImpactTableUnavailable } from "./charity";

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


describe("SkyHope persistence error classification", () => {
  it("degrades only for confirmed missing-table failures", () => {
    expect(
      isImpactTableUnavailable({
        code: "ER_NO_SUCH_TABLE",
        message: "Table 'app.charity_pledges' doesn't exist",
      }),
    ).toBe(true);
    expect(
      isImpactTableUnavailable({
        errno: 1146,
        message: "Table 'app.charity_volunteer_actions' doesn't exist",
      }),
    ).toBe(true);
    expect(
      isImpactTableUnavailable({
        message: "relation \"charity_pledges\" does not exist",
      }),
    ).toBe(true);
    expect(
      isImpactTableUnavailable({
        message: "no such table: charity_volunteer_actions",
      }),
    ).toBe(true);
  });

  it("does not mask permission, connectivity, or other database failures", () => {
    expect(
      isImpactTableUnavailable({
        code: "ER_TABLEACCESS_DENIED_ERROR",
        message: "SELECT command denied for table charity_pledges",
      }),
    ).toBe(false);
    expect(
      isImpactTableUnavailable({
        code: "ECONNRESET",
        message: "connection lost while reading charity_volunteer_actions",
      }),
    ).toBe(false);
    expect(
      isImpactTableUnavailable({
        code: "ER_LOCK_DEADLOCK",
        message: "deadlock while updating charity_pledges",
      }),
    ).toBe(false);
  });
});
