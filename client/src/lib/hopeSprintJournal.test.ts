import { describe, expect, it } from "vitest";
import { createHopePlan } from "./hopeCoach";
import {
  createHopeSprintReceipt,
  getHopeIncompleteSteps,
  isHopeSprintComplete,
  normalizeHopeCompletedStepIds,
  normalizeHopePlanSnapshot,
  normalizeHopeSprintHistory,
  recommendHopeNextAction,
  removeHopeSprintReceipt,
  upsertHopeSprintReceipt,
} from "./hopeSprintJournal";

const activity = {
  lessons: 1,
  posts: 1,
  feedback: 1,
  other: 0,
};

function buildPlan() {
  return createHopePlan({
    goal: "Improve the social beta without fake metrics",
    focus: "build",
    activity,
  });
}

describe("HopeAI sprint closure journal", () => {
  it("accepts only bounded deterministic HopeAI plan snapshots", () => {
    const plan = buildPlan();
    expect(normalizeHopePlanSnapshot(plan)?.title).toBe(plan.title);
    expect(
      normalizeHopePlanSnapshot({ ...plan, provenance: "external-model" })
    ).toBeNull();
    expect(normalizeHopePlanSnapshot({ ...plan, steps: [] })).toBeNull();
  });

  it("normalizes completed steps against the active sprint", () => {
    const plan = buildPlan();
    const first = plan.steps[0].id;
    expect(
      normalizeHopeCompletedStepIds(plan, [first, first, "unknown", 42])
    ).toEqual([first]);
  });

  it("requires every real sprint step before closure", () => {
    const plan = buildPlan();
    expect(isHopeSprintComplete(plan, [])).toBe(false);
    expect(getHopeIncompleteSteps(plan, []).length).toBe(plan.steps.length);
    const all = plan.steps.map(step => step.id);
    expect(isHopeSprintComplete(plan, all)).toBe(true);
    expect(getHopeIncompleteSteps(plan, all)).toEqual([]);
  });

  it("uses missing account evidence before rotating focus", () => {
    expect(
      recommendHopeNextAction(
        { lessons: 0, posts: 3, feedback: 2, other: 0 },
        "build"
      )
    ).toMatchObject({ focus: "learn", href: "/course-catalog" });
    expect(
      recommendHopeNextAction(
        { lessons: 2, posts: 0, feedback: 2, other: 0 },
        "learn"
      )
    ).toMatchObject({ focus: "build", href: "/activity-feed" });
    expect(
      recommendHopeNextAction(
        { lessons: 2, posts: 2, feedback: 0, other: 0 },
        "play"
      )
    ).toMatchObject({ focus: "ship", href: "/beta-feedback" });
    expect(recommendHopeNextAction(activity, "ship")).toMatchObject({
      focus: "build",
      href: "/beta-workspace",
    });
  });

  it("creates a tester-confirmed local receipt only after full completion", () => {
    const plan = buildPlan();
    const completedStepIds = plan.steps.map(step => step.id);
    const receipt = createHopeSprintReceipt({
      plan,
      completedStepIds,
      reflection: "  The route worked and the persisted post was visible.  ",
      activity,
      completedAt: "2026-09-15T18:00:00.000Z",
    });

    expect(receipt.provenance).toBe("tester-confirmed-local-receipt");
    expect(receipt.completedStepIds).toEqual(completedStepIds);
    expect(receipt.stepCount).toBe(plan.steps.length);
    expect(receipt.reflection).toBe(
      "The route worked and the persisted post was visible."
    );
    expect(receipt.nextAction.href).toBe("/sky-school");

    expect(() =>
      createHopeSprintReceipt({
        plan,
        completedStepIds: completedStepIds.slice(0, -1),
        reflection: "Not complete yet",
        activity,
      })
    ).toThrow(/All sprint steps/);
  });

  it("bounds reflections and rejects empty closure notes", () => {
    const plan = buildPlan();
    const completedStepIds = plan.steps.map(step => step.id);
    expect(() =>
      createHopeSprintReceipt({
        plan,
        completedStepIds,
        reflection: "no",
        activity,
      })
    ).toThrow(/at least 5 characters/);

    const receipt = createHopeSprintReceipt({
      plan,
      completedStepIds,
      reflection: "x".repeat(800),
      activity,
      completedAt: "2026-09-15T18:00:00.000Z",
    });
    expect(receipt.reflection).toHaveLength(500);
  });

  it("upserts one receipt per deterministic sprint and caps history", () => {
    const plan = buildPlan();
    const completedStepIds = plan.steps.map(step => step.id);
    const first = createHopeSprintReceipt({
      plan,
      completedStepIds,
      reflection: "First local closure note",
      activity,
      completedAt: "2026-09-15T18:00:00.000Z",
    });
    const replacement = createHopeSprintReceipt({
      plan,
      completedStepIds,
      reflection: "Updated local closure note",
      activity,
      completedAt: "2026-09-15T19:00:00.000Z",
    });

    const history = upsertHopeSprintReceipt([first], replacement);
    expect(history).toHaveLength(1);
    expect(history[0].reflection).toBe("Updated local closure note");
    expect(removeHopeSprintReceipt(history, replacement.id)).toEqual([]);
  });

  it("drops corrupted history records instead of treating them as evidence", () => {
    const plan = buildPlan();
    const receipt = createHopeSprintReceipt({
      plan,
      completedStepIds: plan.steps.map(step => step.id),
      reflection: "Validated local closure",
      activity,
      completedAt: "2026-09-15T18:00:00.000Z",
    });

    expect(
      normalizeHopeSprintHistory([
        receipt,
        { ...receipt, id: "bad", provenance: "model-memory" },
        null,
      ])
    ).toEqual([receipt]);
  });
});
