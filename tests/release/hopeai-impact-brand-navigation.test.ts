import fs from "node:fs";
import { describe, expect, it } from "vitest";

const charity = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");
const navigation = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");
const home = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
const journey = fs.readFileSync("client/src/pages/BetaJourney.tsx", "utf8");
const school = fs.readFileSync("client/src/pages/CourseCatalog.tsx", "utf8");

describe("HopeAI Impact public-brand and navigation contract", () => {
  it("keeps the public charity surface under HopeAI Impact", () => {
    expect(charity).toContain("HopeAI · Impact");
    expect(charity).not.toContain("impact\\n");
    expect(navigation).toContain('{ label: "Impact", route: "/charity", icon: HeartHandshake }');
    expect(navigation).not.toContain('{ label: "SkyHope", route: "/charity"');
    expect(home).toContain('title: "HopeAI Impact"');
    expect(home).not.toContain('title: "SkyHope"');
    expect(journey).toContain("HopeAI Impact actions");
    expect(journey).toContain('{ label: "Impact", href: "/charity" }');
    expect(journey).not.toContain("SkyHope impact");
    expect(school).toContain("HopeAI, Impact, gaming, and social");
    expect(school).not.toContain("HopeAI, SkyHope, gaming, and social");
  });

  it("routes flagship learning entry points through the canonical course catalog", () => {
    expect(charity).toContain('href: "/course-catalog"');
    expect(home).toContain('href: "/course-catalog"');
    expect(navigation).toContain('href: "/course-catalog"');
  });

  it("keeps voice navigation aligned with the public Impact label", () => {
    expect(navigation).toContain("HopeAI, Impact, Journey");
    expect(navigation).not.toContain("HopeAI, SkyHope, Journey");
  });
});
