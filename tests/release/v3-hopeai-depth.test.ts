import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { createHopePlan } from "../../client/src/lib/hopeCoach";
import {
  createHopeSprintReceipt,
  isHopeSprintComplete,
  recommendHopeNextAction,
} from "../../client/src/lib/hopeSprintJournal";

const palette = fs.readFileSync(
  "client/src/components/V3CommandPalette.tsx",
  "utf8"
);
const closure = fs.readFileSync(
  "client/src/components/HopeAISprintClosure.tsx",
  "utf8"
);

describe("V3 HopeAI product-depth release contract", () => {
  it("integrates sprint closure into the existing global shell", () => {
    expect(palette).toMatch(/HopeAISprintClosure/);
    expect(closure).toMatch(/Close HopeAI sprint/);
    expect(closure).toMatch(/Finish the work, record what changed, choose what is next/);
    expect(closure).toMatch(/location\.split[\s\S]*hope-a-i/);
  });

  it("gates closure on all deterministic sprint steps", () => {
    const plan = createHopePlan({
      goal: "ship one beta improvement",
      focus: "ship",
      activity: { lessons: 1, posts: 1, feedback: 1, other: 0 },
    });
    expect(isHopeSprintComplete(plan, [])).toBe(false);
    expect(
      isHopeSprintComplete(plan, plan.steps.map(step => step.id))
    ).toBe(true);
  });

  it("creates a bounded local receipt with a deterministic next action", () => {
    const plan = createHopePlan({
      goal: "learn one thing",
      focus: "learn",
      activity: { lessons: 1, posts: 1, feedback: 1, other: 0 },
    });
    const receipt = createHopeSprintReceipt({
      plan,
      completedStepIds: plan.steps.map(step => step.id),
      reflection: "The authored lesson and check both completed as expected.",
      activity: { lessons: 1, posts: 1, feedback: 1, other: 0 },
      completedAt: "2026-09-15T18:00:00.000Z",
    });
    expect(receipt.provenance).toBe("tester-confirmed-local-receipt");
    expect(receipt.nextAction).toEqual(recommendHopeNextAction(
      { lessons: 1, posts: 1, feedback: 1, other: 0 },
      "learn"
    ));
  });

  it("preserves the no-fake-AI truth boundary", () => {
    expect(closure).toMatch(/not hidden memory, usage analytics, or model training data/);
    expect(closure).toMatch(/does not prove provider-backed AI/);
    expect(closure).toMatch(/durable model memory/);
    expect(closure).toMatch(/autonomous execution/);
    expect(closure).toMatch(/without inventing missing counts/);
  });
});
