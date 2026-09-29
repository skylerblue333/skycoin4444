import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("SkyHope impact beta release contract", () => {
  it("removes fabricated donation and partner claims from the canonical charity route", () => {
    const source = read("client/src/pages/Charity.tsx");

    expect(source).not.toContain("trpc.charity.donate");
    expect(source).not.toContain("WaterAid verified");
    expect(source).not.toContain("On-chain verified");
    expect(source).not.toContain("100% of donations");
    expect(source).not.toContain("Funds distributed within 24 hours");
    expect(source).not.toContain("Top donors");
    expect(source).toContain("No payment execution");
    expect(source).toContain("device-local evidence");
    expect(source).toContain("does not send donations");
  });

  it("connects SkyHope to the major beta journeys", () => {
    const source = read("client/src/pages/Charity.tsx");

    expect(source).toContain('href: "/hope-a-i"');
    expect(source).toContain('href: "/sky-school"');
    expect(source).toContain('href: "/gaming"');
    expect(source).toContain('href: "/activity-feed"');
  });

  it("promotes Charity in global navigation", () => {
    const source = read("client/src/components/BetaNavigation.tsx");

    expect(source).toContain('{ label: "Charity", route: "/charity", icon: HandHeart }');
    expect(source).toContain("Charity");
  });

  it("keeps education and gaming connected to SkyHope without implying payouts", () => {
    const school = read("client/src/pages/SkySchool.tsx");
    const gaming = read("client/src/pages/Gaming.tsx");

    expect(school).toContain('href="/charity"');
    expect(gaming).toContain('href="/charity"');
    expect(gaming).toContain("service planning");
  });
});
