import { describe, expect, it } from "vitest";
import { languageMatchScore, normalizeLanguage, parseTopics } from "../services/languageExchangeMatching";

describe("language exchange matching", () => {
  it("normalizes language labels deterministically", () => {
    expect(normalizeLanguage("  Mandarin Chinese ")).toBe("mandarin chinese");
  });

  it("ranks reciprocal exchange pairs above one-sided pairs", () => {
    const viewer = {
      nativeLanguage: "English",
      learningLanguage: "Chinese",
      topics: "music, software",
    };
    const reciprocal = languageMatchScore(viewer, {
      nativeLanguage: "Chinese",
      learningLanguage: "English",
      topics: "software, travel",
    });
    const oneSided = languageMatchScore(viewer, {
      nativeLanguage: "Chinese",
      learningLanguage: "Spanish",
      topics: "software",
    });

    expect(reciprocal.kind).toBe("reciprocal");
    expect(reciprocal.score).toBe(100);
    expect(reciprocal.sharedTopics).toEqual(["software"]);
    expect(oneSided.kind).toBe("teaches-your-language");
    expect(oneSided.score).toBeLessThan(reciprocal.score);
  });

  it("deduplicates and bounds topic tags", () => {
    expect(parseTopics("Music, music, Travel,  ")).toEqual(["music", "travel"]);
  });
});
