import { describe, expect, it } from "vitest";
import {
  createImpactMission,
  inferImpactCause,
  isImpactMission,
} from "./impactMission";

describe("SkyHope impact mission planner", () => {
  it("builds a deterministic cross-product mission with honest boundaries", () => {
    const first = createImpactMission({
      goal: "Help students learn practical coding skills",
    });
    const second = createImpactMission({
      goal: "  Help   students learn practical coding skills  ",
    });

    expect(first).toEqual(second);
    expect(first.cause).toBe("education");
    expect(first.steps.map(step => step.href)).toEqual([
      "/sky-school",
      "/charity",
      "/gaming-for-charity",
      "/activity-feed",
    ]);
    expect(first.boundary).toEqual({
      mode: "planning-and-evidence",
      financialExecution: false,
      donationSettlement: false,
      custody: false,
      blockchainBroadcast: false,
      beneficiaryVerification: false,
    });
    expect(first.shareText).toMatch(/not claiming a donation/i);
    expect(isImpactMission(first)).toBe(true);
  });

  it.each([
    ["teach a school lesson", "education"],
    ["emergency shelter recovery", "relief"],
    ["clean water and trees", "environment"],
    ["help my neighborhood", "community"],
  ] as const)("maps %s into the %s cause", (goal, cause) => {
    expect(inferImpactCause(goal)).toBe(cause);
  });

  it("bounds arbitrary goals and defaults empty input to a useful mission", () => {
    const long = createImpactMission({ goal: "x".repeat(1_000) });
    const empty = createImpactMission({ goal: "" });

    expect(long.goal.length).toBe(360);
    expect(empty.goal).toMatch(/Help one person or community/);
  });

  it("rejects tampered stored mission objects", () => {
    const mission = createImpactMission({ goal: "community cleanup" });
    expect(
      isImpactMission({
        ...mission,
        boundary: { ...mission.boundary, financialExecution: true },
      })
    ).toBe(false);
    expect(
      isImpactMission({
        ...mission,
        steps: [{ ...mission.steps[0], href: "javascript:alert(1)" }],
      })
    ).toBe(false);
  });
});
