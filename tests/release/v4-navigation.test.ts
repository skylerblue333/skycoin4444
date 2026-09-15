import fs from "node:fs";
import { describe, expect, it } from "vitest";

const navigation = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");

describe("V5 global beta navigation", () => {
  it("brands the primary beta chrome as V5 and routes V5 to the product hub", () => {
    expect(navigation).toContain("V5 engineering beta");
    expect(navigation).toContain('{ label: "V5", route: "/beta-workspace"');
    expect(navigation).not.toContain("V4 engineering beta");
  });

  it("keeps voice navigation aligned with the ten-platform V5 labels", () => {
    expect(navigation).toContain(
      "Listening… say Home, V5, Explore, Social, Live, Gaming, Market, School, HopeAI, Web3, Dating, Global, or Creator."
    );
    expect(navigation).toContain('{ label: "Creator", route: "/creator-dashboard"');
    expect(navigation).toContain(
      '{ label: "Global", route: "/translation-enabled-community"'
    );
    expect(navigation).toContain('{ label: "Dating", route: "/dating-home"');
  });

  it("preserves global search, feedback, account, and Four Fours controls", () => {
    expect(navigation).toContain("V3CommandPalette");
    expect(navigation).toContain("Search all SKYCOIN4444 routes");
    expect(navigation).toContain("/beta-feedback?route=");
    expect(navigation).toContain("isAuthenticated ? \"/dashboard\" : \"/signin\"");
    expect(navigation).toContain("You found the Four Fours.");
    expect(navigation).toContain(
      "No fake progress. Build it. Test it. Integrate it. Prove it."
    );
  });
});
