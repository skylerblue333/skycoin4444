import fs from "node:fs";
import { describe, expect, it } from "vitest";

const app = fs.readFileSync("client/src/App.tsx", "utf8");
const nav = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");
const home = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
const button = fs.readFileSync("client/src/components/ui/button.tsx", "utf8");
const card = fs.readFileSync("client/src/components/ui/card.tsx", "utf8");
const input = fs.readFileSync("client/src/components/ui/input.tsx", "utf8");

describe("ecosystem navigation and visual foundation", () => {
  it("mounts one persistent navigation shell across routed surfaces", () => {
    expect(app).toContain('import BetaNavigation from "./components/BetaNavigation"');
    expect(app).toMatch(/<BetaNavigation \/>/);
    expect(nav).toMatch(/SKYCOIN4444 beta navigation/);

    for (const route of [
      "/beta-workspace",
      "/activity-feed",
      "/course-catalog",
      "/arcade",
      "/live-streaming",
      "/beta-commerce",
      "/language-partner-discovery",
      "/dating-profile-setup",
      "/beta-web3",
      "/a-i-tools-hub",
      "/beta-feedback",
    ]) {
      expect(nav).toContain(route);
    }
  });

  it("makes the home page a front door to every headline beta journey", () => {
    for (const route of [
      "/activity-feed",
      "/live-streaming",
      "/course-catalog",
      "/arcade",
      "/beta-commerce",
      "/language-partner-discovery",
      "/dating-profile-setup",
      "/beta-web3",
      "/a-i-tools-hub",
    ]) {
      expect(home).toContain(route);
    }
    expect(home).toMatch(/60 beta routes/);
    expect(home).toMatch(/9.*headline journeys/);
    expect(home).toMatch(/No invented users, traffic, balances/);
  });

  it("modernizes shared controls instead of only one page", () => {
    expect(button).toMatch(/rounded-xl/);
    expect(button).toMatch(/active:scale/);
    expect(card).toMatch(/rounded-2xl/);
    expect(card).toMatch(/backdrop-blur-xl/);
    expect(input).toMatch(/rounded-xl/);
    expect(input).toMatch(/focus-visible:ring-ring\/40/);
  });
});
