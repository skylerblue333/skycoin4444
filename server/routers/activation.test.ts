import { describe, expect, it } from "vitest";
import { summarizeActivation } from "./activation";

describe("durable activation summary", () => {
  it("reports the first incomplete persisted gate deterministically", () => {
    expect(
      summarizeActivation({
        account: true,
        profile: true,
        learning: false,
        social: false,
        feedback: false,
      })
    ).toMatchObject({
      completedCount: 2,
      totalCount: 5,
      percent: 40,
      activated: false,
      nextStep: "learning",
      nextRoute: "/course-catalog",
    });
  });

  it("marks the journey activated only when every evidence gate is complete", () => {
    const result = summarizeActivation({
      account: true,
      profile: true,
      learning: true,
      social: true,
      feedback: true,
    });

    expect(result.activated).toBe(true);
    expect(result.completedCount).toBe(5);
    expect(result.percent).toBe(100);
    expect(result.nextStep).toBeNull();
    expect(result.nextRoute).toBe("/activity-evidence");
  });

  it("keeps sign-in as the first gate for unauthenticated state", () => {
    const result = summarizeActivation({
      account: false,
      profile: false,
      learning: false,
      social: false,
      feedback: false,
    });

    expect(result.percent).toBe(0);
    expect(result.nextStep).toBe("account");
    expect(result.nextRoute).toBe("/signin");
  });
});
