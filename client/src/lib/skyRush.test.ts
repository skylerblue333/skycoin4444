import { describe, expect, it } from "vitest";
import {
  emptyRushScore,
  resolveRushTick,
  rushFrame,
  rushRank,
} from "./skyRush";

describe("Sky Rush deterministic game core", () => {
  it("generates repeatable safe frames", () => {
    expect(rushFrame(44, 7)).toEqual(rushFrame(44, 7));

    for (let tick = 0; tick < 100; tick += 1) {
      const frame = rushFrame(4444, tick);
      expect([0, 1, 2]).toContain(frame.obstacleLane);
      expect([0, 1, 2]).toContain(frame.sparkLane);
      expect(frame.sparkLane).not.toBe(frame.obstacleLane);
      expect(frame.speedTier).toBeGreaterThanOrEqual(1);
      expect(frame.speedTier).toBeLessThanOrEqual(5);
    }
  });

  it("collects non-monetary sparks and builds combo", () => {
    const frame = rushFrame(44, 1);
    const result = resolveRushTick({
      lane: frame.sparkLane,
      frame,
      previous: emptyRushScore(),
    });

    expect(result.crashed).toBe(false);
    expect(result.collectedSpark).toBe(true);
    expect(result.next.sparks).toBeGreaterThanOrEqual(1);
    expect(result.next.combo).toBe(1);
    expect(result.next.score).toBeGreaterThan(0);
  });

  it("resets combo on obstacle collision without negative score", () => {
    const frame = rushFrame(44, 2);
    const result = resolveRushTick({
      lane: frame.obstacleLane,
      frame,
      previous: {
        distance: 12,
        sparks: 3,
        combo: 4,
        bestCombo: 4,
        score: 500,
      },
    });

    expect(result.crashed).toBe(true);
    expect(result.next.combo).toBe(0);
    expect(result.next.score).toBe(500);
    expect(result.next.sparks).toBe(3);
  });

  it("maps score to bounded session ranks", () => {
    expect(rushRank(0)).toBe("Rookie");
    expect(rushRank(500)).toBe("Spark");
    expect(rushRank(1200)).toBe("Pulse");
    expect(rushRank(2200)).toBe("Comet");
    expect(rushRank(3500)).toBe("Nova");
  });
});
