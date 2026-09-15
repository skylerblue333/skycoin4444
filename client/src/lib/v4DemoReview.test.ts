import { describe, expect, it } from "vitest";
import {
  buildV4DemoReviewSummary,
  getV4DemoReviewAverage,
  getV4DemoReviewWeakest,
  isV4DemoReviewComplete,
  normalizeV4DemoReview,
  setV4DemoReviewRating,
} from "@/lib/v4DemoReview";

describe("V4 demo review", () => {
  it("normalizes only bounded 1-10 ratings", () => {
    expect(
      normalizeV4DemoReview({
        ratings: {
          clarity: 8.4,
          usefulness: 11,
          polish: 0,
          trust: 7,
          returnIntent: 9,
          unknown: 10,
        },
      })
    ).toEqual({
      ratings: {
        clarity: 8,
        trust: 7,
        returnIntent: 9,
      },
    });
  });

  it("computes a subjective average without inventing missing dimensions", () => {
    let review = normalizeV4DemoReview(null);
    review = setV4DemoReviewRating(review, "clarity", 10);
    review = setV4DemoReviewRating(review, "polish", 6);
    expect(getV4DemoReviewAverage(review)).toBe(8);
    expect(isV4DemoReviewComplete(review)).toBe(false);
  });

  it("marks a review complete only after all five dimensions exist", () => {
    let review = normalizeV4DemoReview(null);
    for (const [id, rating] of [
      ["clarity", 9],
      ["usefulness", 8],
      ["polish", 7],
      ["trust", 10],
      ["returnIntent", 8],
    ] as const) {
      review = setV4DemoReviewRating(review, id, rating);
    }
    expect(isV4DemoReviewComplete(review)).toBe(true);
    expect(getV4DemoReviewAverage(review)).toBe(8.4);
    expect(getV4DemoReviewWeakest(review).map(item => item.id)).toEqual([
      "polish",
      "usefulness",
    ]);
  });

  it("builds a copyable review that states its evidence boundary", () => {
    let review = normalizeV4DemoReview(null);
    review = setV4DemoReviewRating(review, "clarity", 9);
    const summary = buildV4DemoReviewSummary(review);
    expect(summary).toContain("V4 demo review");
    expect(summary).toContain("Clarity: 9/10");
    expect(summary).toContain("subjective review");
    expect(summary).toContain("not analytics");
  });
});