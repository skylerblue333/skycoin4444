import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { createHopePlan } from "../../client/src/lib/hopeCoach";

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
const skyHopeCore = fs.readFileSync(
  "client/src/lib/skyHopeImpact.ts",
  "utf8"
);

describe("HopeAI + SkyHope ecosystem integration", () => {
  it("routes impact-focused HopeAI plans into canonical SkyHope", () => {
    const plan = createHopePlan({
      goal: "build a charity impact plan for local students",
      focus: "impact",
      activity: { lessons: 1, posts: 1, feedback: 1, other: 0 },
    });

    expect(plan.steps.some(step => step.href === "/charity")).toBe(true);
    expect(plan.coachNote).toMatch(/beneficiar|donation/i);
    expect(hope).toMatch(/id: "impact"/);
    expect(hope).toContain('href="/charity"');
  });

  it("preserves the canonical truthful SkyHope workspace", () => {
    expect(skyHopeCore).toMatch(/createSkyHopeCampaignPlan/);
    expect(skyHopeCore).toMatch(/scoreImpactReadiness/);
    expect(charity).toMatch(/No live donations or custody/);
    expect(charity).toMatch(/Real-value execution is gated/);
    expect(charity).not.toMatch(/on-chain verified/i);
    expect(charity).not.toMatch(/DAO_PROPOSALS/);
    expect(charity).not.toMatch(/LEADERBOARD/);
    expect(charity).toContain('href: "/activity-feed"');
  });

  it("connects the SkySchool hub and Impact Play Lab back to SkyHope", () => {
    expect(school).toContain('href="/charity"');
    expect(school).toMatch(/Impact learning mission/);
    expect(impactPlay).toContain('href="/charity"');
    expect(impactPlay).toMatch(/Open SkyHope mission/);
  });

  it("preserves the already-merged primary School and SkyHope navigation", () => {
    expect(navigation).toContain(
      '{ label: "School", route: "/course-catalog", icon: GraduationCap }'
    );
    expect(navigation).toContain(
      '{ label: "SkyHope", route: "/charity", icon: HeartHandshake }'
    );
    expect(navigation).toMatch(/School, HopeAI, SkyHope/);
  });
});
