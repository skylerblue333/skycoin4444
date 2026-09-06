import fs from "node:fs";
import { describe, expect, it } from "vitest";

const indexPath = "docs/FAMILY-TIME-CAPSULE-INDEX.md";
const index = fs.readFileSync(indexPath, "utf8");
const dadForLater = fs.readFileSync(
  "client/src/components/DadForLater.tsx",
  "utf8"
);

describe("family time-capsule source index", () => {
  it("keeps a durable source map for the major family artifacts", () => {
    expect(index).toContain("ThreeLightsEasterEgg.tsx");
    expect(index).toContain("DadForLater.tsx");
    expect(index).toContain("DadsFieldGuide.tsx");
    expect(index).toContain("DadsToolkit.tsx");
    expect(index).toContain("BetaNavigation.tsx");
    expect(index).toContain("SkyMarkEasterEgg.tsx");
  });

  it("preserves the main discovery phrases", () => {
    expect(index).toContain("Dad's Letter in the Stars");
    expect(index).toContain("Dad for Later");
    expect(index).toContain("Dad's Field Guide");
    expect(index).toContain("Dad's Pocket Toolkit");
    expect(index).toContain("Dad's ridiculous coin vault");
    expect(index).toContain("You found the Four Fours.");
    expect(index).toContain("Love, Dad");
  });

  it("makes the non-financial and non-obligation boundaries explicit", () => {
    expect(index).toContain("not a financial document");
    expect(index).toContain("no financial value");
    expect(index).toContain("responsibility for Dad's problems");
    expect(index).toContain("responsibility for finishing Dad's work");
    expect(index).toContain("Build lives that belong to you.");
  });

  it("documents how to recover the writing if the UI stops working", () => {
    expect(index).toContain("If the interface no longer runs");
    expect(index).toContain("The messages are ordinary source text.");
    expect(index).toContain("A Git repository or hosted service is not guaranteed");
    expect(dadForLater).toContain("FAMILY-TIME-CAPSULE-INDEX");
  });
});
