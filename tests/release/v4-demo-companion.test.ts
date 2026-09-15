import fs from "node:fs";
import { describe, expect, it } from "vitest";

const companion = fs.readFileSync(
  "client/src/components/V4DemoCompanion.tsx",
  "utf8"
);
const commandPalette = fs.readFileSync(
  "client/src/components/V3CommandPalette.tsx",
  "utf8"
);
const journeyNavigator = fs.readFileSync(
  "client/src/components/V3JourneyNavigator.tsx",
  "utf8"
);
const evidenceCompanion = fs.readFileSync(
  "client/src/components/V3JourneyEvidenceCompanion.tsx",
  "utf8"
);

describe("V4 cross-page demo companion", () => {
  it("mounts through the existing global beta shell", () => {
    expect(commandPalette).toContain(
      'import V4DemoCompanion from "@/components/V4DemoCompanion"'
    );
    expect(commandPalette).toContain("<V4DemoCompanion />");
  });

  it("only appears after a guided route visit and hides on control routes", () => {
    expect(companion).toContain("!session.visitedStepIds.length");
    expect(companion).toContain('path === "/beta-workspace"');
    expect(companion).toContain('path === "/signin"');
    expect(companion).toContain('path === "/beta-feedback"');
  });

  it("shows current proof and a next guided stop without marking product evidence", () => {
    expect(companion).toContain("Current demo moment");
    expect(companion).toContain("Proof to look for");
    expect(companion).toContain("progress.nextStep.route");
    expect(companion).toContain("markV4DemoStepVisited");
    expect(companion).toContain("route visits only");
    expect(companion).toContain("does not mark");
    expect(companion).not.toContain("setV3JourneyStageComplete");
    expect(companion).not.toContain("createV3JourneyEvidenceReceipt");
  });

  it("has an explicit off-track recovery path", () => {
    expect(companion).toContain("demo is paused on a route outside the selected track");
    expect(companion).toContain('href="/beta-workspace"');
    expect(companion).toContain("Back to V4");
  });

  it("avoids the existing bottom-right journey and evidence controls", () => {
    expect(journeyNavigator).toContain("fixed bottom-4 right-4");
    expect(evidenceCompanion).toContain("fixed bottom-20 right-4");
    expect(companion).toContain("fixed bottom-32 right-4");
  });
});