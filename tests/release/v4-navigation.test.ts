import fs from "node:fs";
import { describe, expect, it } from "vitest";

const navigation = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");

describe("V4 global beta navigation", () => {
  it("brands the primary beta chrome as V4 and routes V4 to the command center", () => {
    expect(navigation).toContain("V4 engineering beta");
    expect(navigation).toContain('{ label: "V4", route: "/beta-workspace"');
    expect(navigation).not.toContain("V3 engineering beta");
  });

  it("keeps voice navigation aligned with the V4 label", () => {
    expect(navigation).toContain("Listening… say Home, V4, Explore, Social, Learn, Gaming, Live, Shop, Language, Dating, Web3, or HopeAI.");
  });

  it("preserves global search, feedback, account, and Four Fours controls", () => {
    expect(navigation).toContain("V3CommandPalette");
    expect(navigation).toContain("Search all SKYCOIN4444 routes");
    expect(navigation).toContain("/beta-feedback?route=");
    expect(navigation).toContain("isAuthenticated ? \"/dashboard\" : \"/signin\"");
    expect(navigation).toContain("You found the Four Fours.");
    expect(navigation).toContain("No fake progress. Build it. Test it. Integrate it. Prove it.");
  });
});
