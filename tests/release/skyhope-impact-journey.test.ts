import fs from "node:fs";
import { describe, expect, it } from "vitest";

const charity = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");
const gaming = fs.readFileSync("client/src/pages/GamingForCharity.tsx", "utf8");
const navigation = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");
const courses = fs.readFileSync("client/src/data/gapCourses.ts", "utf8");
const planner = fs.readFileSync("client/src/lib/skyHopeImpact.ts", "utf8");

describe("SkyHope impact journey release contract", () => {
  it("replaces unsupported charity execution claims with an evidence-first planner", () => {
    expect(charity).toContain("SkyHope Impact Workspace");
    expect(charity).toContain("No live donation execution");
    expect(charity).toContain("buildSkyHopeImpactPlan");
    expect(charity).toContain('href: "/hope-a-i"');
    expect(charity).toContain('href: "/sky-school"');
    expect(charity).toContain('href: "/gaming-for-charity"');
    expect(charity).toContain('href: "/activity-feed"');
    expect(charity).not.toContain("WaterAid verified");
    expect(charity).not.toContain("100% of donations go directly");
    expect(charity).not.toContain("On-chain verified");
    expect(charity).not.toContain("Diamond Donor");
  });

  it("keeps campaign drafts local and financial execution off", () => {
    expect(charity).toContain("skyhope.impact.drafts.v1");
    expect(charity).toContain("Device-local");
    expect(planner).toContain("executesPayments: false");
    expect(planner).toContain("acceptsCustody: false");
    expect(planner).toContain("writesBlockchainTransactions: false");
    expect(planner).toContain("durableServerCampaignStore: false");
  });

  it("connects SkyHope to education, gaming, and primary navigation", () => {
    expect(courses).toContain("skyhope-impact-101");
    expect(courses).toContain("Responsible Giving & Impact Evidence");
    expect(navigation).toMatch(/label: "SkyHope", route: "\/charity"/);
    expect(gaming).toContain("Impact allocation drill");
    expect(gaming).toContain("Game-only planning score");
    expect(gaming).toContain('href="/charity"');
  });
});
