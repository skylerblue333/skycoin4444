import { describe, expect, it } from "vitest";
import { completionPercent, resolveNextSteps, validateLearningPath } from "./index";

const path = {
  id: "path-1",
  title: "Foundations",
  steps: [
    { id: "a", title: "Intro", prerequisites: [], estimatedMinutes: 10 },
    { id: "b", title: "Core", prerequisites: ["a"], estimatedMinutes: 20 },
    { id: "c", title: "Practice", prerequisites: ["b"], estimatedMinutes: 30 },
  ],
};

describe("SkyLearningPaths", () => {
  it("exposes only unblocked next steps", () => {
    expect(resolveNextSteps(path, { completedStepIds: [] }).available.map(step => step.id)).toEqual(["a"]);
    expect(resolveNextSteps(path, { completedStepIds: ["a"] }).available.map(step => step.id)).toEqual(["b"]);
  });

  it("reports missing prerequisites", () => {
    expect(resolveNextSteps(path, { completedStepIds: [] }).blocked).toEqual([
      { stepId: "b", missingPrerequisites: ["a"] },
      { stepId: "c", missingPrerequisites: ["b"] },
    ]);
  });

  it("computes completion using only known steps", () => {
    expect(completionPercent(path, { completedStepIds: ["a", "unknown"] })).toBe(33.33);
  });

  it("validates duplicate and missing prerequisite references", () => {
    const errors = validateLearningPath({
      id: "p",
      title: "Bad",
      steps: [
        { id: "a", title: "A", prerequisites: [], estimatedMinutes: 1 },
        { id: "a", title: "Again", prerequisites: ["missing"], estimatedMinutes: 1 },
      ],
    });
    expect(errors).toContain("duplicate step id: a");
    expect(errors).toContain("unknown prerequisite missing for a");
  });
});
