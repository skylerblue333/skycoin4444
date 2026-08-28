import { describe, expect, it } from "vitest";
import { createTalentMatchRequested, matchTalent, normalizeTalentProfile } from "./index";

describe("SkyTalent", () => {
  it("normalizes profiles and deduplicates skills", () => {
    expect(normalizeTalentProfile({ id: " p1 ", headline: " Builder ", skills: ["TypeScript", "typescript"] })).toEqual({
      id: "p1",
      headline: "Builder",
      skills: ["typescript"],
      availability: "available",
    });
  });

  it("matches and sorts deterministically", () => {
    const matches = matchTalent(
      [
        { id: "b", headline: "B", skills: ["typescript"] },
        { id: "a", headline: "A", skills: ["typescript", "node"] },
      ],
      { skills: ["typescript", "node"] },
    );
    expect(matches.map((match) => [match.profile.id, match.score])).toEqual([
      ["a", 1],
      ["b", 0.5],
    ]);
  });

  it("creates a versioned advisory request contract and validates its limit", () => {
    expect(createTalentMatchRequested({ skills: ["React"] }).type).toBe("sky.talent.match.requested.v1");
    expect(() => createTalentMatchRequested({ limit: 0 })).toThrow(/limit/);
    expect(() => createTalentMatchRequested({ limit: 101 })).toThrow(/limit/);
    expect(() => createTalentMatchRequested({ limit: 1.5 })).toThrow(/limit/);
  });

  it("uses locale-independent tie-breaking for equal scores", () => {
    const matches = matchTalent(
      [
        { id: "ä", headline: "A", skills: ["typescript"] },
        { id: "z", headline: "Z", skills: ["typescript"] },
      ],
      { skills: ["typescript"] },
    );
    expect(matches.map((match) => match.profile.id)).toEqual(["z", "ä"]);
  });
});
