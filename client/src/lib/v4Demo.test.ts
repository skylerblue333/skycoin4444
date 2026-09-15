import { describe, expect, it } from "vitest";
import {
  getV4DemoProgress,
  getV4DemoTrackSteps,
  markV4DemoStepVisited,
  normalizeV4DemoSession,
  resetV4DemoSession,
  setV4DemoTrack,
  v4DemoSteps,
  v4DemoTracks,
} from "@/lib/v4Demo";

const flagshipIds = new Set(v4DemoSteps.map(step => step.flagshipId));

describe("V4 demo story model", () => {
  it("covers all seven V4 flagships in the ultimate demo", () => {
    const steps = getV4DemoTrackSteps("ultimate");
    expect(steps).toHaveLength(7);
    expect(new Set(steps.map(step => step.flagshipId))).toEqual(flagshipIds);
    expect(flagshipIds.size).toBe(7);
  });

  it("normalizes corrupted local demo state without inventing visits", () => {
    expect(
      normalizeV4DemoSession({
        trackId: "not-real",
        visitedStepIds: ["social-publish", "missing", "social-publish", 42],
      })
    ).toEqual({
      trackId: "ultimate",
      visitedStepIds: ["social-publish"],
    });
  });

  it("tracks route visits separately from evidence completion", () => {
    let session = normalizeV4DemoSession(null);
    expect(getV4DemoProgress(session)).toMatchObject({
      visitedCount: 0,
      totalCount: 7,
      percent: 0,
    });

    session = markV4DemoStepVisited(session, "social-publish");
    session = markV4DemoStepVisited(session, "live-room");
    expect(getV4DemoProgress(session)).toMatchObject({
      visitedCount: 2,
      totalCount: 7,
      percent: 29,
    });
    expect(session).not.toHaveProperty("completedFlagships");
  });

  it("preserves visits across quick-demo track changes and resets deliberately", () => {
    let session = markV4DemoStepVisited(
      normalizeV4DemoSession(null),
      "social-publish"
    );
    session = setV4DemoTrack(session, "creator");
    expect(getV4DemoProgress(session).visitedCount).toBe(1);
    expect(getV4DemoProgress(session).totalCount).toBe(3);

    session = resetV4DemoSession(session);
    expect(session).toEqual({ trackId: "creator", visitedStepIds: [] });
  });

  it("keeps every track bounded to known demo steps", () => {
    const known = new Set(v4DemoSteps.map(step => step.id));
    for (const track of v4DemoTracks) {
      expect(track.stepIds.length).toBeGreaterThan(0);
      expect(track.stepIds.every(id => known.has(id))).toBe(true);
    }
  });
});