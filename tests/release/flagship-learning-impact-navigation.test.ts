import fs from "node:fs";
import { describe, expect, it } from "vitest";

const nav = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");
const journey = fs.readFileSync("client/src/pages/BetaJourney.tsx", "utf8");
const school = fs.readFileSync("client/src/pages/CourseCatalog.tsx", "utf8");

describe("flagship learning, HopeAI, SkyHope, social, and gaming paths", () => {
  it("promotes SkySchool and SkyHope into the persistent primary navigation", () => {
    expect(nav).toContain('{ label: "School", route: "/course-catalog", icon: GraduationCap }');
    expect(nav).toContain('{ label: "SkyHope", route: "/charity", icon: HeartHandshake }');
    expect(nav).toContain("School, HopeAI, SkyHope");
  });

  it("connects SkySchool to the four requested flagship areas", () => {
    for (const route of ["/hope-a-i", "/charity", "/gaming", "/activity-feed"]) {
      expect(school).toContain(route);
    }
    expect(school).toContain("Connected learning paths");
    expect(school).toContain("Provider availability and HopeAI's execution boundaries still apply.");
    expect(school).toContain("does not process a donation");
    expect(school).toContain("does not create wagers, payouts, or token rewards");
  });

  it("keeps the durable activation loop separate from optional cross-area exploration", () => {
    expect(journey).toContain("same five gates measured by the onboarding");
    expect(journey).toContain("Connected ecosystem paths");
    expect(journey).toContain("Learn once, then move somewhere useful.");
    for (const route of ["/hope-a-i", "/charity", "/gaming"]) {
      expect(journey).toContain(route);
    }
  });

  it("keeps provider, donation, and real-value gaming claims fail-closed", () => {
    expect(journey).toContain("configured AI availability");
    expect(journey).toContain("does not itself process a donation");
    expect(journey).toContain("does not turn game activity into real-value wagering or rewards");
    expect(journey).toContain("guaranteed AI-provider availability");
    expect(journey).toContain("live donation");
    expect(journey).toContain("real-value gaming");
  });
});
