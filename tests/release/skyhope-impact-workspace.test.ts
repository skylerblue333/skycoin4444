import fs from "node:fs";
import { describe, expect, it } from "vitest";

const page = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");
const core = fs.readFileSync("client/src/lib/skyHopeImpact.ts", "utf8");

describe("SkyHope impact workspace release contract", () => {
  it("removes unsupported live-donation and fake-governance claims", () => {
    expect(page).not.toMatch(/trpc\.charity\.donate/);
    expect(page).not.toMatch(/DAO_PROPOSALS/);
    expect(page).not.toMatch(/LEADERBOARD/);
    expect(page).not.toMatch(/on-chain verified/i);
    expect(page).not.toMatch(/100% of donations go directly/i);
    expect(page).toMatch(/No live donations or custody/);
    expect(page).toMatch(/Real-value execution is gated/);
  });

  it("connects SkyHope to the canonical ecosystem paths", () => {
    expect(page).toContain('href: "/hope-a-i"');
    expect(page).toContain('href: "/sky-school"');
    expect(page).toContain('href: "/activity-feed"');
    expect(page).toContain('href: "/gaming"');
    expect(page).toMatch(/href="\/fundraiser-tools"/);
    expect(page).toMatch(/href="\/impact-metrics"/);
    expect(page).toMatch(/href="\/gaming-for-charity"/);
  });

  it("ships deterministic planning and evidence controls", () => {
    expect(core).toMatch(/createSkyHopeCampaignPlan/);
    expect(core).toMatch(/createVolunteerCapacityPlan/);
    expect(core).toMatch(/scoreImpactReadiness/);
    expect(core).toMatch(/deterministic-local-plan/);
    expect(page).toMatch(/Build plan/);
    expect(page).toMatch(/Evidence checklist/);
    expect(page).toMatch(/Volunteer capacity planner/);
  });
});
