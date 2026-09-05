import { describe, expect, it } from "vitest";
import {
  createHopePlan,
  summarizeHopeActivity,
} from "./hopeCoach";

describe("HopeAI deterministic coach", () => {
  it("summarizes only supplied account activity", () => {
    expect(
      summarizeHopeActivity([
        { type: "lesson_completed" },
        { type: "lesson_completed" },
        { type: "post_created" },
        { type: "feedback_submitted" },
        { type: "privacy_request" },
      ])
    ).toEqual({
      lessons: 2,
      posts: 1,
      feedback: 1,
      other: 1,
    });
  });

  it("routes gaming goals into a playable loop without model claims", () => {
    const plan = createHopePlan({
      goal: "Make the gaming hub more fun with a rush game",
      focus: "play",
      activity: {
        lessons: 1,
        posts: 1,
        feedback: 0,
        other: 0,
      },
    });

    expect(plan.provenance).toBe("deterministic-local-planner");
    expect(plan.steps.some(step => step.href === "/gaming")).toBe(true);
    expect(plan.steps.some(step => step.href === "/game-sky-rush")).toBe(true);
    expect(plan.steps.some(step => step.href === "/beta-feedback")).toBe(true);
    expect(plan.coachNote).toMatch(/does not call an external model/);
  });

  it("prioritizes missing durable learning evidence", () => {
    const plan = createHopePlan({
      goal: "",
      focus: "build",
      activity: {
        lessons: 0,
        posts: 2,
        feedback: 1,
        other: 0,
      },
    });

    expect(
      plan.steps.some(step => step.id === "activity-learning")
    ).toBe(true);
  });

  it("normalizes and bounds user goals", () => {
    const plan = createHopePlan({
      goal: "   learn    TypeScript   " + "x".repeat(600),
      focus: "learn",
      activity: {
        lessons: 1,
        posts: 1,
        feedback: 1,
        other: 0,
      },
    });

    expect(plan.title.length).toBeLessThanOrEqual(520);
    expect(plan.title).not.toMatch(/\s{2,}/);
  });
});
