import { describe, expect, it } from "vitest";
import {
  buildImpactPlan,
  createImpactJournalEntry,
  parseImpactJournal,
} from "../client/src/lib/hopeImpact";

describe("SkyHope impact planning core", () => {
  it("builds deterministic bounded plans", () => {
    const first = buildImpactPlan({
      trackId: "shelter-care",
      availableMinutes: 90,
      teamSize: 2,
    });
    const second = buildImpactPlan({
      trackId: "shelter-care",
      availableMinutes: 90,
      teamSize: 2,
    });

    expect(first).toEqual(second);
    expect(first.availableMinutes).toBe(90);
    expect(first.teamSize).toBe(2);
    expect(first.plannedUnits).toBe(4);
    expect(first.receiptId).toMatch(/^hope-[a-z0-9]+$/);
  });

  it("clamps unsafe or unrealistic planner inputs", () => {
    const plan = buildImpactPlan({
      trackId: "digital-access",
      availableMinutes: Number.POSITIVE_INFINITY,
      teamSize: 200,
    });

    expect(plan.availableMinutes).toBe(15);
    expect(plan.teamSize).toBe(20);
    expect(plan.plannedUnits).toBeGreaterThanOrEqual(1);
  });

  it("creates local journal records without claiming external verification", () => {
    const plan = buildImpactPlan({
      trackId: "education-access",
      availableMinutes: 60,
      teamSize: 1,
    });
    const entry = createImpactJournalEntry(plan, 1_700_000_000_000);

    expect(entry.completed).toBe(false);
    expect(entry.trackId).toBe("education-access");
    expect(entry.receiptId).toBe(plan.receiptId);
  });

  it("fails closed on malformed local journal data", () => {
    expect(parseImpactJournal("{not json")).toEqual([]);
    expect(parseImpactJournal(JSON.stringify([{ id: "fake" }]))).toEqual([]);
  });
});
