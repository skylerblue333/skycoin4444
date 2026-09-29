import { describe, expect, it } from "vitest";
import {
  SKYHOPE_CAMPAIGNS,
  isImpactIdempotencyConflict,
  isImpactTableUnavailable,
} from "./charity";

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


describe("SkyHope pledge idempotency conflict classification", () => {
  it("recognizes only duplicate-key failures tied to the pledge idempotency boundary", () => {
    expect(
      isImpactIdempotencyConflict({
        code: "ER_DUP_ENTRY",
        errno: 1062,
        message:
          "Duplicate entry 'user-key' for key 'charity_pledges_user_idempotency_unique'",
      }),
    ).toBe(true);
    expect(
      isImpactIdempotencyConflict({
        code: "23505",
        message:
          'duplicate key value violates unique constraint "charity_pledges_user_idempotency_unique"',
      }),
    ).toBe(true);
    expect(
      isImpactIdempotencyConflict({
        code: "SQLITE_CONSTRAINT_UNIQUE",
        message:
          "UNIQUE constraint failed: charity_pledges.user_id, charity_pledges.idempotency_key",
      }),
    ).toBe(true);
  });

  it("does not hide unrelated duplicate or database failures", () => {
    expect(
      isImpactIdempotencyConflict({
        code: "ER_DUP_ENTRY",
        errno: 1062,
        message: "Duplicate entry 'pledge-id' for key 'PRIMARY'",
      }),
    ).toBe(false);
    expect(
      isImpactIdempotencyConflict({
        code: "ER_LOCK_DEADLOCK",
        message: "deadlock while inserting charity_pledges",
      }),
    ).toBe(false);
    expect(
      isImpactIdempotencyConflict({
        code: "ECONNRESET",
        message: "connection lost while inserting charity_pledges",
      }),
    ).toBe(false);
  });
});
