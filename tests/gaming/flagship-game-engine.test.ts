import { describe, expect, it } from "vitest";
import {
  crashCurveMultiplier,
  crashPoint,
  createDeck,
  cryptoChallenge,
  EUROPEAN_ROULETTE_ORDER,
  handValue,
  hashHuntRound,
  isBlackjack,
  nextCardRank,
  PLINKO_MULTIPLIERS_10,
  resolveHighLow,
  rouletteColor,
  roulettePayoutMultiplier,
  rouletteRotationFor,
  simulatePlinko,
  spinRoulette,
} from "../../client/src/lib/flagshipGameEngine";

describe("flagship game engine", () => {
  it("creates a deterministic 52-card deck", () => {
    const first = createDeck(4444);
    const second = createDeck(4444);
    expect(first).toHaveLength(52);
    expect(first).toEqual(second);
    expect(new Set(first.map(card => card.rank + card.suit)).size).toBe(52);
  });

  it("scores blackjack aces and naturals correctly", () => {
    expect(handValue([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♥" }])).toBe(21);
    expect(isBlackjack([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♥" }])).toBe(true);
    expect(handValue([{ rank: "A", suit: "♠" }, { rank: "A", suit: "♥" }, { rank: "9", suit: "♦" }])).toBe(21);
  });

  it("keeps the ten-row Plinko board deterministic and visually addressable", () => {
    const drop = simulatePlinko(77, 10);
    expect(drop).toEqual(simulatePlinko(77, 10));
    expect(drop.path).toHaveLength(10);
    expect(drop.points).toHaveLength(11);
    expect(drop.bucket).toBeGreaterThanOrEqual(0);
    expect(drop.bucket).toBeLessThanOrEqual(10);
    expect(drop.multiplier).toBe(PLINKO_MULTIPLIERS_10[drop.bucket]);
    expect(drop.points.every(point => point.x >= 0 && point.x <= 100 && point.y >= 0 && point.y <= 100)).toBe(true);
  });

  it("resolves high-low including ties", () => {
    expect(resolveHighLow(7, 10, "higher")).toBe("win");
    expect(resolveHighLow(7, 3, "higher")).toBe("lose");
    expect(resolveHighLow(7, 7, "lower")).toBe("push");
    expect(nextCardRank(10)).toBeGreaterThanOrEqual(1);
    expect(nextCardRank(10)).toBeLessThanOrEqual(13);
  });

  it("uses one 37-pocket European roulette order with bounded rotation", () => {
    expect(EUROPEAN_ROULETTE_ORDER).toHaveLength(37);
    expect(new Set(EUROPEAN_ROULETTE_ORDER).size).toBe(37);
    expect(EUROPEAN_ROULETTE_ORDER[0]).toBe(0);
    expect(rouletteRotationFor(32)).toBeGreaterThan(360);

    const result = spinRoulette(99);
    expect(EUROPEAN_ROULETTE_ORDER).toContain(result.number);
    expect(result.rotation).toBeGreaterThan(360);
    expect(rouletteColor(0)).toBe("green");
    expect(roulettePayoutMultiplier(7, { kind: "number", number: 7 })).toBe(36);
    expect(roulettePayoutMultiplier(0, { kind: "even" })).toBe(0);
  });

  it("keeps crash outcomes deterministic and curve growth monotonic", () => {
    expect(crashPoint(444)).toBe(crashPoint(444));
    expect(crashPoint(444)).toBeGreaterThanOrEqual(1.01);
    expect(crashPoint(444)).toBeLessThanOrEqual(25);
    expect(crashCurveMultiplier(0)).toBe(1);
    expect(crashCurveMultiplier(4000)).toBeGreaterThan(crashCurveMultiplier(2000));
    expect(crashCurveMultiplier(2000)).toBeGreaterThan(crashCurveMultiplier(1000));
  });

  it("produces deterministic crypto skill rounds", () => {
    const challenge = cryptoChallenge(42);
    expect(challenge.choices[challenge.correctIndex]).toBeTruthy();
    const hunt = hashHuntRound(42);
    expect(hunt.candidates).toHaveLength(4);
    expect(hunt.candidates[hunt.answerIndex].startsWith(hunt.target)).toBe(true);
  });
});
