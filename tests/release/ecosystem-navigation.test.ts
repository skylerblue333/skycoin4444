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
      "/sky-school",
      "/gaming",
      "/live",
      "/beta-commerce",
      "/translation-enabled-community",
      "/dating-home",
      "/beta-web3",
      "/hope-a-i",
      "/creator-dashboard",
      "/beta-feedback",
    ]) {
      expect(nav).toContain(route);
    }
  });

  it("makes the home page a front door to every headline beta journey", () => {
    for (const route of [
      "/activity-feed",
      "/live",
      "/sky-school",
      "/gaming",
      "/beta-commerce",
      "/language-partner-discovery",
      "/dating-profile-setup",
      "/beta-web3",
      "/hope-a-i",
    ]) {
      expect(home).toContain(route);
    }
    expect(home).toMatch(/Ten places worth tapping first/);
    expect(home).toMatch(/No fake account balance/);
    expect(home).toMatch(/Premium presentation, careful claims/);
  });

  it("modernizes shared controls instead of only one page", () => {
    expect(button).toMatch(/rounded-xl/);
    expect(button).toMatch(/active:scale/);
    expect(card).toMatch(/rounded-2xl/);
    expect(card).toMatch(/backdrop-blur-xl/);
    expect(input).toMatch(/rounded-xl/);
    expect(input).toMatch(/focus-visible:ring-amber-300\/20/);
  });
});
