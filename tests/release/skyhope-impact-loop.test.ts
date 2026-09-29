import fs from "node:fs";
import { describe, expect, it } from "vitest";

const charity = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");
const navigation = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8",
);
const gaming = fs.readFileSync("client/src/pages/Gaming.tsx", "utf8");
const school = fs.readFileSync("client/src/pages/SkySchool.tsx", "utf8");
const leaderboard = fs.readFileSync(
  "client/src/pages/CharityLeaderboard.tsx",
  "utf8",
);
const impactMap = fs.readFileSync("client/src/pages/ImpactMap.tsx", "utf8");

describe("SkyHope impact loop release boundary", () => {
  it("removes fake charity execution claims from the canonical charity surface", () => {
    expect(charity).toContain("trpc.charity.boundary");
    expect(charity).toContain("trpc.charity.missions");
    expect(charity).toContain("trpc.charity.evaluateFinance");
    expect(charity).not.toContain("trpc.charity.donate");
    expect(charity).not.toMatch(/on-chain verified|100% of donations|partnership with wateraid/i);
    expect(charity).toContain("SkyHopePersonalPlanner");
    expect(charity).toContain("No live donations");
  });

  it("removes synthetic donor and geographic impact claims from legacy charity routes", () => {
    expect(leaderboard).not.toMatch(/Top Donors|Total Donated|Donate Now/i);
    expect(impactMap).not.toMatch(/Live Donations|Total Raised|\d+ helped/i);
    expect(leaderboard).toContain("No donor leaderboard");
    expect(impactMap).toContain("intentionally empty");
  });

  it("makes HopeAI, SkySchool, Gaming, and SkyHope part of one navigation loop", () => {
    expect(navigation).toContain('route: "/charity"');
    expect(navigation).toContain('route: "/sky-school"');
    expect(navigation).toContain('route: "/hope-a-i"');
    expect(navigation).toContain('route: "/gaming"');
  });

  it("adds the shared impact rail to learning and gaming", () => {
    expect(school).toContain("SkyHopeImpactRail");
    expect(gaming).toContain("SkyHopeImpactRail");
  });
});
