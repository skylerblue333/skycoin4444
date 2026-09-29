import { describe, expect, it } from "vitest";
import { buildEcosystemJourney } from "./index";

describe("ecosystem journey", () => {
  it("connects social learning gaming and impact into one deterministic journey", () => {
    const journey = buildEcosystemJourney({
      socialPosts: 1,
      lessonsCompleted: 2,
      arcadePlays: 4,
      charityPledges: 0,
      volunteerMinutes: 20,
    });

    expect(journey.completedCount).toBe(4);
    expect(journey.completionPercent).toBe(100);
    expect(journey.missions.map(mission => mission.id)).toEqual([
      "social",
      "learn",
      "play",
      "impact",
    ]);
    expect(journey.hopeAI.route).toBe("/hope-a-i");
    expect(journey.hopeAI.persistedCompletionTracked).toBe(false);
  });

  it("chooses the first incomplete mission as the next action", () => {
    const journey = buildEcosystemJourney({
      socialPosts: 1,
      lessonsCompleted: 0,
      arcadePlays: 0,
      charityPledges: 0,
      volunteerMinutes: 0,
    });

    expect(journey.completionPercent).toBe(25);
    expect(journey.nextMission.id).toBe("learn");
    expect(journey.nextMission.route).toBe("/sky-school");
  });

  it("does not count tiny or invalid impact values as completed work", () => {
    const journey = buildEcosystemJourney({
      socialPosts: -1,
      lessonsCompleted: Number.NaN,
      arcadePlays: 0,
      charityPledges: 0,
      volunteerMinutes: 14,
    });

    expect(journey.completedCount).toBe(0);
    expect(journey.missions.find(mission => mission.id === "impact")?.complete).toBe(false);
  });
});
