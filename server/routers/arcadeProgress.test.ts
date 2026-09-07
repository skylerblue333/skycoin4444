import { describe, expect, it } from "vitest";
import {
  arcadeGameIdSchema,
  arcadeRunInputSchema,
} from "./arcadeProgress";

describe("arcade progress API input policy", () => {
  it("accepts only promoted recordable game ids", () => {
    expect(arcadeGameIdSchema.parse("sky-rush")).toBe("sky-rush");
    expect(() => arcadeGameIdSchema.parse("arcade-lab")).toThrow();
    expect(() => arcadeGameIdSchema.parse("fake-game")).toThrow();
  });

  it("bounds client-reported progress values", () => {
    expect(
      arcadeRunInputSchema.parse({
        gameId: "crypto-quiz",
        score: 700,
        sparks: 12,
        xp: 500,
        combo: 4,
      })
    ).toEqual({
      gameId: "crypto-quiz",
      score: 700,
      sparks: 12,
      xp: 500,
      combo: 4,
    });

    expect(() =>
      arcadeRunInputSchema.parse({
        gameId: "sky-rush",
        score: 10_000_001,
      })
    ).toThrow();
    expect(() =>
      arcadeRunInputSchema.parse({
        gameId: "sky-rush",
        score: 10,
        sparks: -1,
      })
    ).toThrow();
  });
});
