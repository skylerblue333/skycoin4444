import fs from "node:fs";
import { describe, expect, it } from "vitest";

const nav = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");
const journey = fs.readFileSync("client/src/pages/BetaJourney.tsx", "utf8");
const normalizedJourney = journey.replace(/\s+/g, " ");
const school = fs.readFileSync("client/src/pages/CourseCatalog.tsx", "utf8");

describe("flagship learning, HopeAI Impact, social, and gaming paths", () => {
  it("promotes SkySchool and Impact into the persistent primary navigation", () => {
    expect(nav).toContain('{ label: "School", route: "/course-catalog", icon: GraduationCap }');
    expect(nav).toContain('{ label: "Impact", route: "/charity", icon: HeartHandshake }');
    expect(nav).toContain("School, HopeAI, Impact");
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
    expect(normalizedJourney).toContain("same five gates measured by the onboarding");
    expect(normalizedJourney).toContain("Connected ecosystem paths");
    expect(normalizedJourney).toContain("Learn once, then move somewhere useful.");
    for (const route of ["/hope-a-i", "/charity", "/gaming"]) {
      expect(normalizedJourney).toContain(route);
    }
  });

  it("keeps provider, donation, and real-value gaming claims fail-closed", () => {
    expect(normalizedJourney).toContain("configured AI availability");
    expect(normalizedJourney).toContain("does not itself process a donation");
    expect(normalizedJourney).toContain("does not turn game activity into real-value wagering or rewards");
    expect(normalizedJourney).toContain("guaranteed AI-provider availability");
    expect(normalizedJourney).toContain("live donation");
    expect(normalizedJourney).toContain("real-value gaming");
  });
});
