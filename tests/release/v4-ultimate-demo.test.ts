import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { v4Flagships } from "../../client/src/lib/v4Beta";
import {
  getV4DemoTrackSteps,
  v4DemoSteps,
  v4DemoTracks,
} from "../../client/src/lib/v4Demo";

const workspaceSource = fs.readFileSync(
  "client/src/pages/BetaWorkspace.tsx",
  "utf8"
);
const directorSource = fs.readFileSync(
  "client/src/components/V4DemoDirector.tsx",
  "utf8"
);

describe("V4 ultimate demo", () => {
  it("puts the guided demo before the wider V4 command center", () => {
    expect(workspaceSource).toContain("V4DemoDirector");
    expect(workspaceSource).toMatch(/<V4DemoDirector \/>[\s\S]*<V4Beta \/>/);
    expect(directorSource).toContain("One product story. Seven moments worth showing.");
    expect(directorSource).toContain("Run");
    expect(directorSource).toContain("Resume");
  });

  it("covers all seven proven flagships without inventing an eighth product", () => {
    const ultimate = getV4DemoTrackSteps("ultimate");
    expect(ultimate).toHaveLength(7);
    expect(new Set(ultimate.map(step => step.flagshipId))).toEqual(
      new Set(v4Flagships.map(flagship => flagship.id))
    );
    expect(v4DemoTracks).toHaveLength(4);
  });

  it("keeps every demo route anchored to its flagship entry route", () => {
    const entryById = new Map(
      v4Flagships.map(flagship => [flagship.id, flagship.entryRoute])
    );
    for (const step of v4DemoSteps) {
      expect(step.route).toBe(entryById.get(step.flagshipId));
      expect(step.proof.length).toBeGreaterThan(60);
      expect(step.promise.length).toBeGreaterThan(50);
    }
  });

  it("separates navigation coverage from real journey evidence", () => {
    expect(directorSource).toContain(
      "Visited means opened from this demo. It is not a tester pass."
    );
    expect(directorSource).toContain("Underlying evidence");
    expect(directorSource).toContain("existing six-stage journey checklists");
    expect(directorSource).toContain("markV4DemoStepVisited");
    expect(directorSource).not.toContain("setV4FlagshipComplete");
  });

  it("closes the guided story into feedback and preserves product truth", () => {
    expect(directorSource).toContain("Tour covered · report what broke");
    expect(directorSource).toContain("/beta-feedback?route=%2Fbeta-workspace");
    expect(directorSource).toContain("No payment, custody, AI-provider, or scale fiction.");
    expect(directorSource).toContain("does not");
    expect(directorSource).toContain("production readiness");
    expect(directorSource).toContain("market value");
  });
});