import { describe, expect, it } from "vitest";
import {
  buildConnectionSignals,
  buildConversationStarters,
  parseDatingDraftSignals,
  scoreDatingProfile,
  sharedDatingInterests,
} from "./datingExperience";

describe("dating experience helpers", () => {
  it("scores profile quality without pretending it is identity verification", () => {
    expect(
      scoreDatingProfile({
        displayName: "Sky",
        bio: "I like building things, hiking, music, and long conversations.",
        location: "Fayetteville, AR",
        interests: ["Music", "Hiking", "Technology"],
        photoCount: 2,
        lookingFor: "relationship",
      }),
    ).toEqual({ score: 100, missing: [] });

    const incomplete = scoreDatingProfile({
      displayName: "S",
      bio: "Short",
      location: "",
      interests: ["Music"],
      photoCount: 0,
      lookingFor: "",
    });
    expect(incomplete.score).toBe(0);
    expect(incomplete.missing).toContain("Choose at least 3 interests");
  });

  it("parses only adult browser-session drafts", () => {
    const valid = parseDatingDraftSignals(
      JSON.stringify({
        displayName: "Sky",
        bio: "A sufficiently descriptive bio for the profile.",
        age: 26,
        location: "Arkansas",
        interests: ["Chess", "Music"],
        lookingFor: "relationship",
        photoCount: 2,
        storage: "browser-session",
      }),
    );

    expect(valid?.age).toBe(26);
    expect(
      parseDatingDraftSignals(
        JSON.stringify({
          displayName: "Teen",
          bio: "Bio",
          age: 17,
          location: "Arkansas",
          interests: ["Chess"],
          lookingFor: "friendship",
          photoCount: 1,
          storage: "browser-session",
        }),
      ),
    ).toBeNull();
  });

  it("finds shared interests without duplicates", () => {
    expect(
      sharedDatingInterests(
        ["Chess", "Music"],
        ["music", "Hiking", "MUSIC", "Chess"],
      ),
    ).toEqual(["music", "Chess"]);
  });

  it("builds transparent connection signals from saved profile facts", () => {
    const signals = buildConnectionSignals(
      {
        displayName: "Sky",
        bio: "Builder",
        age: 26,
        location: "Fayetteville, AR",
        interests: ["Chess", "Music"],
        lookingFor: "relationship",
        photoCount: 2,
      },
      {
        displayName: "Alex",
        bio: "Hello",
        location: "Fayetteville, AR",
        interests: ["Music", "Hiking"],
      },
    );

    expect(signals).toContain("You both listed Music.");
    expect(signals).toContain("You listed the same general location.");
  });

  it("creates respectful deterministic conversation starters", () => {
    expect(
      buildConversationStarters({
        displayName: "Alex",
        bio: "Hello",
        location: "Austin, TX",
        interests: ["Cooking", "Hiking"],
      }),
    ).toEqual([
      "What got you into Cooking?",
      "What do you enjoy most about Hiking?",
      "What is a place you enjoy around Austin, TX?",
    ]);
  });
});
