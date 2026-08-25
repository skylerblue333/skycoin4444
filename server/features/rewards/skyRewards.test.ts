import { describe, expect, it } from "vitest";
import { calculateRewardBalance, createRewardEntry } from "./skyRewards";

describe("SkyRewards", () => {
  it("calculates deterministic balances", () => {
    const entries = [
      createRewardEntry({
        id: "r1",
        accountId: "acct:1",
        points: 100,
        reason: "earn",
        createdAtMs: 1,
      }),
      createRewardEntry({
        id: "r2",
        accountId: "acct:1",
        points: -40,
        reason: "redeem",
        createdAtMs: 2,
      }),
    ];

    expect(calculateRewardBalance("acct:1", entries)).toEqual({
      accountId: "acct:1",
      availablePoints: 60,
    });
  });

  it("rejects a redemption that would create a negative balance", () => {
    const entry = createRewardEntry({
      id: "r1",
      accountId: "acct:1",
      points: -1,
      reason: "redeem",
      createdAtMs: 1,
    });

    expect(() => calculateRewardBalance("acct:1", [entry])).toThrow(
      "reward balance cannot become negative or unsafe"
    );
  });

  it("rejects duplicate entry identifiers", () => {
    const entry = createRewardEntry({
      id: "r1",
      accountId: "acct:1",
      points: 5,
      reason: "earn",
      createdAtMs: 1,
    });

    expect(() => calculateRewardBalance("acct:1", [entry, entry])).toThrow(
      "duplicate reward entry"
    );
  });

  it("validates reason and point direction", () => {
    expect(() =>
      createRewardEntry({
        id: "r1",
        accountId: "acct:1",
        points: -5,
        reason: "earn",
        createdAtMs: 1,
      })
    ).toThrow("earn entries must add points");
  });
});
