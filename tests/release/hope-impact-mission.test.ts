import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { createImpactMission } from "../../client/src/lib/impactMission";

const charity = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");
const hope = fs.readFileSync("client/src/pages/HopeAI.tsx", "utf8");
const navigation = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8"
);
const school = fs.readFileSync("client/src/pages/SkySchool.tsx", "utf8");
const impactPlay = fs.readFileSync(
  "client/src/pages/GamingForCharity.tsx",
  "utf8"
);

describe("HopeAI + SkyHope impact mission integration", () => {
  it("connects one deterministic mission across education, charity, gaming and social", () => {
    const mission = createImpactMission({
      goal: "Help students learn technology safely",
    });

    expect(mission.steps.map(step => step.href)).toEqual([
      "/sky-school",
      "/charity",
      "/gaming-for-charity",
      "/activity-feed",
    ]);
    expect(mission.boundary.financialExecution).toBe(false);
    expect(mission.boundary.donationSettlement).toBe(false);
  });

  it("makes charity a real planning/evidence surface instead of a fake token economy", () => {
    expect(charity).toMatch(/Impact Mission Center/);
    expect(charity).toMatch(/planning and evidence only/i);
    expect(charity).toMatch(/No live donations/i);
    expect(charity).toMatch(/createImpactMission/);
    expect(charity).toMatch(/IMPACT_MISSION_STORAGE_KEY/);
    expect(charity).not.toMatch(/Diamond Donor/);
    expect(charity).not.toMatch(/CryptoKing/);
    expect(charity).not.toMatch(/on-chain verified/i);
    expect(charity).not.toMatch(/Confirm Donation/);
    expect(charity).not.toMatch(/donate\.mutate/);
  });

  it("gives HopeAI an impact focus with cross-page continuity", () => {
    expect(hope).toMatch(/id: "impact"/);
    expect(hope).toMatch(/Build a charity impact mission/);
    expect(hope).toMatch(/createImpactMission/);
    expect(hope).toMatch(/IMPACT_MISSION_STORAGE_KEY/);
    expect(hope).toContain('href="/charity"');
  });

  it("surfaces charity in major navigation and keeps education/gaming connected", () => {
    expect(navigation).toMatch(
      /label: "Hope", route: "\/charity"/
    );
    expect(navigation).toMatch(
      /label: "Charity", route: "\/charity"/
    );
    expect(school).toContain('href="/charity"');
    expect(impactPlay).toContain('href="/charity"');
  });
});
