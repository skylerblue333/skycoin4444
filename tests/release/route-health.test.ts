import fs from "node:fs";
import { describe, expect, it } from "vitest";

const app = fs.readFileSync("client/src/App.tsx", "utf8");
const health = fs.readFileSync("client/src/lib/routeHealth.ts", "utf8");
const page = fs.readFileSync("client/src/pages/RouteHealth.tsx", "utf8");
const nav = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");

describe("route health control room", () => {
  it("registers the control-room route and keeps it discoverable through global route search", () => {
    expect(app).toMatch(/path="\/route-health" component=\{RouteHealth\}/);
    expect(nav).toMatch(/V3CommandPalette/);
    expect(nav).toMatch(/Search all SKYCOIN4444 routes/);
  });

  it("covers the major ecosystem areas with explicit evidence states", () => {
    for (const route of ["/", "/activity-feed", "/course-catalog", "/sky-school", "/gaming", "/arcade", "/live", "/beta-commerce", "/beta-web3", "/hope-a-i", "/dating-profile-setup"]) {
      expect(health).toContain(`route: "${route}"`);
    }
    expect(health).toMatch(/state: "working"/);
    expect(health).toMatch(/state: "controlled"/);
    expect(health).toMatch(/routeHealthCounts/);
  });

  it("keeps the dashboard honest and recoverable", () => {
    expect(page).toMatch(/One evidence view/);
    expect(page).toMatch(/does not invent uptime, traffic, users, balances/);
    expect(page).toMatch(/Open screen/);
    expect(page).toMatch(/Recovery path/);
  });
});
