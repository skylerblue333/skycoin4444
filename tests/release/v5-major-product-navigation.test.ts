import fs from "node:fs";
import { describe, expect, it } from "vitest";
import routeCatalog from "../../client/src/data/routeCatalog.json";
import {
  betaExperienceAreas,
  findBetaExperienceAreaForRoute,
} from "../../client/src/data/betaExperienceAreas";

const navigationSource = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8",
);
const homeSource = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
const journeySource = fs.readFileSync(
  "client/src/pages/BetaJourney.tsx",
  "utf8",
);

const majorPaths = [
  { id: "social", route: "/activity-feed" },
  { id: "gaming", route: "/gaming" },
  { id: "hopeai", route: "/hope-a-i" },
  { id: "school-language", route: "/sky-school" },
  { id: "impact", route: "/charity" },
] as const;

describe("V5 major product navigation", () => {
  it("keeps every promoted major path in the generated route catalog", () => {
    const registered = new Set(routeCatalog.routes.map(route => route.path));

    for (const path of majorPaths) {
      expect(registered.has(path.route), path.route).toBe(true);
    }
  });

  it("maps the major paths to explicit product-facing experience areas", () => {
    const areas = new Map(betaExperienceAreas.map(area => [area.id, area]));

    for (const path of majorPaths) {
      expect(areas.get(path.id)?.route).toBe(path.route);
      expect(findBetaExperienceAreaForRoute(path.route)?.id).toBe(path.id);
    }

    expect(areas.get("hopeai")?.status).toBe("controlled_beta");
    expect(areas.get("impact")?.status).toBe("controlled_beta");
    expect(areas.get("social")?.status).toBe("core_beta");
    expect(areas.get("gaming")?.status).toBe("core_beta");
    expect(areas.get("school-language")?.status).toBe("core_beta");
  });

  it("promotes SkySchool, HopeAI and SkyHope from the global navigation", () => {
    expect(navigationSource).toContain(
      '{ label: "School", route: "/sky-school", icon: GraduationCap }',
    );
    expect(navigationSource).toContain(
      '{ label: "HopeAI", route: "/hope-a-i", icon: Bot }',
    );
    expect(navigationSource).toContain(
      '{ label: "SkyHope", route: "/charity", icon: HeartHandshake }',
    );
    expect(navigationSource).toMatch(/say Home, V5, Explore, Social, Live, Gaming, School, HopeAI, SkyHope/);
  });

  it("makes SkyHope visible from the launchpad without changing its truth boundary", () => {
    expect(homeSource).toMatch(/<Link href="\/charity">/);
    expect(homeSource).toMatch(/Open SkyHope/);
    expect(homeSource).toContain(
      '{ id: "impact", label: "Open SkyHope impact", href: "/charity", icon: HeartHandshake }',
    );

    const impact = betaExperienceAreas.find(area => area.id === "impact");
    expect(impact?.description).toMatch(/donation execution/i);
    expect(impact?.description).toMatch(/verification boundaries/i);
  });

  it("connects the durable onboarding journey to AI, social, games, school and impact", () => {
    expect(journeySource).toMatch(/const continueAreas = \[/);

    for (const path of majorPaths) {
      expect(journeySource).toContain(`href: "${path.route}"`);
    }

    expect(journeySource).toMatch(/Use the major product loop without route hunting/);
    expect(journeySource).toMatch(/does not issue credentials, token rewards/);
  });
});
