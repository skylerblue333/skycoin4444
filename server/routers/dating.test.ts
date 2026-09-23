import { describe, expect, it } from "vitest";
import {
  buildDatingConnectionEvidence,
  datingActionInputSchema,
  datingDiscoveryInputSchema,
  datingPreferencesInputSchema,
  parseDatingInterests,
  sameGeneralDatingLocation,
} from "./dating";

describe("dating router domain policy", () => {
  it("parses stored interests defensively", () => {
    expect(parseDatingInterests(JSON.stringify(["Chess", "Music", "  Hiking  "]))).toEqual([
      "Chess",
      "Music",
      "Hiking",
    ]);
    expect(parseDatingInterests("not-json")).toEqual([]);
    expect(parseDatingInterests(JSON.stringify(["Chess", 42, null]))).toEqual(["Chess"]);
  });

  it("requires adult preference ranges and ordered bounds", () => {
    expect(
      datingPreferencesInputSchema.parse({
        minAge: 21,
        maxAge: 35,
        genderPreference: "everyone",
      })
    ).toMatchObject({ minAge: 21, maxAge: 35 });

    expect(() =>
      datingPreferencesInputSchema.parse({
        minAge: 17,
        maxAge: 35,
        genderPreference: "everyone",
      })
    ).toThrow();

    expect(() =>
      datingPreferencesInputSchema.parse({
        minAge: 40,
        maxAge: 30,
        genderPreference: "everyone",
      })
    ).toThrow();
  });

  it("keeps discovery filters bounded", () => {
    expect(
      datingDiscoveryInputSchema.parse({
        minAge: 18,
        maxAge: 80,
        genderPreference: "women",
        location: "Austin",
        interest: "Music",
        limit: 20,
      })
    ).toMatchObject({
      minAge: 18,
      maxAge: 80,
      genderPreference: "women",
      limit: 20,
    });

    expect(() => datingDiscoveryInputSchema.parse({ limit: 500 })).toThrow();
  });

  it("accepts only explicit dating actions", () => {
    expect(
      datingActionInputSchema.parse({
        profileUserId: "user-2",
        action: "superlike",
      })
    ).toEqual({ profileUserId: "user-2", action: "superlike" });
    expect(() =>
      datingActionInputSchema.parse({
        profileUserId: "user-2",
        action: "message",
      })
    ).toThrow();
  });

  it("compares location components instead of unsafe substrings", () => {
    expect(sameGeneralDatingLocation("Austin, TX", "Austin, TX")).toBe(true);
    expect(sameGeneralDatingLocation("Austin, TX", "Dallas, TX")).toBe(true);
    expect(sameGeneralDatingLocation("Kansas", "Arkansas")).toBe(false);
    expect(sameGeneralDatingLocation("", "Arkansas")).toBe(false);
  });

  it("returns factual shared signals rather than relationship predictions", () => {
    expect(
      buildDatingConnectionEvidence(
        {
          location: "Austin, TX",
          interests: JSON.stringify(["Chess", "Music"]),
        },
        {
          location: "Dallas, TX",
          interests: JSON.stringify(["Music", "Hiking"]),
        }
      )
    ).toEqual({
      sharedInterests: ["Music"],
      sameGeneralLocation: true,
      sharedSignalCount: 2,
    });
  });
});
