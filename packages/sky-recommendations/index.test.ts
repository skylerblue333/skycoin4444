import { describe, expect, it } from "vitest";
import { rankRecommendations, SKY_RECOMMENDATIONS_CONTRACT } from "./index";

describe("SkyRecommendations", () => {
  it("ranks deterministically with stable tie breaking", () => {
    expect(rankRecommendations([
      { id: "b", relevance: 0.8, affinity: 0.4 },
      { id: "a", relevance: 0.8, affinity: 0.4 },
      { id: "c", relevance: 0.5, affinity: 1 },
    ], 2)).toEqual([
      { id: "a", score: 0.7, rank: 1 },
      { id: "b", score: 0.7, rank: 2 },
    ]);
    expect(SKY_RECOMMENDATIONS_CONTRACT).toBe("sky.recommendations.ranked.v1");
  });

  it("uses locale-independent code-unit ordering for tied ids", () => {
    expect(rankRecommendations([
      { id: "ä", relevance: 0.8, affinity: 0.4 },
      { id: "z", relevance: 0.8, affinity: 0.4 },
    ])).toEqual([
      { id: "z", score: 0.7, rank: 1 },
      { id: "ä", score: 0.7, rank: 2 },
    ]);
  });

  it("rejects malformed candidates", () => {
    expect(() => rankRecommendations([])).toThrow("candidates");
    expect(() => rankRecommendations([{ id: " ", relevance: 0.5 }])).toThrow("id");
    expect(() => rankRecommendations([{ id: "a", relevance: 1.1 }])).toThrow("relevance");
    expect(() => rankRecommendations([{ id: "a", relevance: 0.5 }, { id: "a", relevance: 0.4 }])).toThrow("unique");
    expect(() => rankRecommendations([{ id: "a", relevance: 0.5 }], 0)).toThrow("limit");
  });
});
