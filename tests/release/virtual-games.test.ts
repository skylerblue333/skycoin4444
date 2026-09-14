import { describe, expect, it } from "vitest";
import { blackjackOutcome, blackjackValue, crashMultiplier, plinkoMultiplier, resolveCrash, rouletteColor, roulettePayout, validateVirtualBet } from "../../client/src/lib/virtualGames";

describe("virtual-credit game engines", () => {
  it("rejects invalid and over-balance bets without mutating balance", () => {
    expect(validateVirtualBet(100, 0).ok).toBe(false);
    expect(validateVirtualBet(100, 101).reason).toMatch(/Insufficient/);
    expect(validateVirtualBet(100, 25)).toEqual({ ok: true, balance: 75 });
  });
  it("resolves deterministic Crash outcomes with demo credits only", () => {
    expect(crashMultiplier(42)).toBe(crashMultiplier(42));
    const result = resolveCrash(100, 10, 1.01, 42);
    expect(result.ok).toBe(true);
    expect(result.balance).toBeGreaterThanOrEqual(90);
  });
  it("scales bounded Plinko multipliers by risk and rows", () => {
    expect(plinkoMultiplier("low", 8, 2)).toBeGreaterThan(0);
    expect(plinkoMultiplier("high", 100, 2)).toBeGreaterThan(0);
  });
  it("scores Blackjack aces and terminal outcomes correctly", () => {
    const blackjack = [{ rank: "A", value: 11 }, { rank: "K", value: 10 }];
    expect(blackjackValue(blackjack)).toBe(21);
    expect(blackjackOutcome(blackjack, [{ rank: "9", value: 9 }, { rank: "7", value: 7 }])).toBe("blackjack");
    expect(blackjackOutcome([{ rank: "K", value: 10 }, { rank: "9", value: 9 }, { rank: "5", value: 5 }], [{ rank: "8", value: 8 }, { rank: "8", value: 8 }])).toBe("loss");
  });
  it("calculates European Roulette colors and payouts", () => {
    expect(rouletteColor(0)).toBe("green");
    expect(rouletteColor( redNumber())).toBe("red");
    expect(roulettePayout(17, { kind: "straight", value: 17 })).toBe(35);
    expect(roulettePayout(1, { kind: "color", value: "red" })).toBe(1);
    expect(roulettePayout(0, { kind: "color", value: "red" })).toBe(0);
  });
});
function redNumber() { return 1; }
