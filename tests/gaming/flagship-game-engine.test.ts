import { describe, expect, it } from "vitest";
import {
  crashPoint,
  createDeck,
  cryptoChallenge,
  handValue,
  hashHuntRound,
  isBlackjack,
  nextCardRank,
  resolveHighLow,
  rouletteColor,
  roulettePayoutMultiplier,
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

  it("scores blackjack aces correctly", () => {
    expect(handValue([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♥" }])).toBe(21);
    expect(isBlackjack([{ rank: "A", suit: "♠" }, { rank: "K", suit: "♥" }])).toBe(true);
    expect(handValue([{ rank: "A", suit: "♠" }, { rank: "A", suit: "♥" }, { rank: "9", suit: "♦" }])).toBe(21);
  });

  it("keeps Plinko deterministic and bounded", () => {
    const drop = simulatePlinko(77, 10);
    expect(drop).toEqual(simulatePlinko(77, 10));
    expect(drop.path).toHaveLength(10);
    expect(drop.bucket).toBeGreaterThanOrEqual(0);
    expect(drop.bucket).toBeLessThanOrEqual(10);
    expect(drop.multiplier).toBeGreaterThan(0);
  });

  it("resolves high-low including ties", () => {
    expect(resolveHighLow(7, 10, "higher")).toBe("win");
    expect(resolveHighLow(7, 3, "higher")).toBe("lose");
    expect(resolveHighLow(7, 7, "lower")).toBe("push");
    expect(nextCardRank(10)).toBeGreaterThanOrEqual(1);
    expect(nextCardRank(10)).toBeLessThanOrEqual(13);
  });

  it("keeps roulette result and payout rules bounded", () => {
    const result = spinRoulette(99);
    expect(result.number).toBeGreaterThanOrEqual(0);
    expect(result.number).toBeLessThanOrEqual(36);
    expect(rouletteColor(0)).toBe("green");
    expect(roulettePayoutMultiplier(7, { kind: "number", number: 7 })).toBe(36);
    expect(roulettePayoutMultiplier(0, { kind: "even" })).toBe(0);
  });

  it("keeps crash outcomes deterministic and within demo bounds", () => {
    expect(crashPoint(444)).toBe(crashPoint(444));
    expect(crashPoint(444)).toBeGreaterThanOrEqual(1.01);
    expect(crashPoint(444)).toBeLessThanOrEqual(25);
  });

  it("produces deterministic crypto skill rounds", () => {
    const challenge = cryptoChallenge(42);
    expect(challenge.choices[challenge.correctIndex]).toBeTruthy();
    const hunt = hashHuntRound(42);
    expect(hunt.candidates).toHaveLength(4);
    expect(hunt.candidates[hunt.answerIndex].startsWith(hunt.target)).toBe(true);
  });
});
