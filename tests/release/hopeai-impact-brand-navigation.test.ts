import fs from "node:fs";
import { describe, expect, it } from "vitest";

const navigation = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");
const home = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
const journey = fs.readFileSync("client/src/pages/BetaJourney.tsx", "utf8");
const school = fs.readFileSync("client/src/pages/CourseCatalog.tsx", "utf8");

describe("HopeAI Impact public-brand and flagship navigation contract", () => {
  it("keeps the primary public charity identity under HopeAI Impact", () => {
    expect(navigation).toContain('{ label: "Impact", route: "/charity", icon: HeartHandshake }');
    expect(navigation).not.toContain('{ label: "SkyHope", route: "/charity"');
    expect(home).toContain('title: "HopeAI Impact"');
    expect(home).not.toContain('title: "SkyHope"');
    expect(home).toContain('label: "Record one Impact action"');
    expect(journey).toContain("HopeAI Impact actions");
    expect(journey).toContain('{ label: "Impact", href: "/charity" }');
    expect(journey).toContain("Impact persistence:");
    expect(journey).toContain(">HopeAI Impact</CardTitle>");
    expect(journey).toContain(">Open Impact</Button>");
    expect(journey).not.toContain("SkyHope impact");
    expect(school).toContain("HopeAI Impact's charity and service-planning path");
    expect(school).toContain('action: "Open Impact"');
    expect(school).toContain("HopeAI, Impact, gaming, and social");
  });

  it("routes flagship learning entry points through the canonical course catalog", () => {
    expect(home).toMatch(/title: "SkySchool",[\s\S]*?href: "\/course-catalog"/);
    expect(navigation).toContain('href: "/course-catalog"');
  });

  it("keeps HopeAI, Impact, and School one tap away on the persistent mobile bar", () => {
    expect(navigation).toContain("const mobilePriorityLinks = [");
    expect(navigation).toContain('{ label: "HopeAI", route: "/hope-a-i", icon: Bot }');
    expect(navigation).toContain('{ label: "Impact", route: "/charity", icon: HeartHandshake }');
    expect(navigation).toContain('{ label: "School", route: "/course-catalog", icon: GraduationCap }');
    expect(navigation).toContain('aria-current={active ? "page" : undefined}');
    expect(navigation).toContain('aria-expanded={mobileOpen}');
  });

  it("keeps voice navigation aligned with the public Impact label", () => {
    expect(navigation).toContain("HopeAI, Impact, Journey");
    expect(navigation).not.toContain("HopeAI, SkyHope, Journey");
  });
});
