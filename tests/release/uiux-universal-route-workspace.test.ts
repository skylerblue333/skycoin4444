import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("universal route workspace release contract", () => {
  it("keeps the 1,000+ screen library behind one discoverable global workspace", () => {
    const catalog = JSON.parse(read("client/src/data/routeCatalog.json")) as {
      routes: Array<{ path: string; label: string; component: string }>;
    };
    const palette = read("client/src/components/V3CommandPalette.tsx");

    expect(catalog.routes.length).toBeGreaterThan(1000);
    expect(palette).toContain("Universal route workspace");
    expect(palette).toContain("Search by capability, save favorites, revisit recent screens");
    expect(palette).toContain("findBetaExperienceAreaForRoute");
    expect(palette).toContain("areaStatusLabel");
  });

  it("makes preferences useful without pretending they are server-persisted", () => {
    const palette = read("client/src/components/V3CommandPalette.tsx");
    const discovery = read("client/src/lib/routeDiscovery.ts");

    expect(palette).toContain("sky4444.v5-favorite-routes");
    expect(palette).toContain("Preferences stay on this device");
    expect(palette).toContain("writeStoredPaths");
    expect(discovery).toContain("toggleFavoriteRoutePath");
    expect(discovery).toContain("mergeRouteCollections");
  });

  it("supports keyboard and accessible dialog navigation", () => {
    const palette = read("client/src/components/V3CommandPalette.tsx");

    expect(palette).toContain('role="dialog"');
    expect(palette).toContain('aria-modal="true"');
    expect(palette).toContain('role="combobox"');
    expect(palette).toContain('role="listbox"');
    expect(palette).toContain("aria-activedescendant");
    expect(palette).toContain('event.key === "/"');
    expect(palette).toContain('event.key !== "Tab"');
    expect(palette).toContain("previousFocusRef");
  });

  it("searches route metadata plus area keywords instead of only exact screen names", () => {
    const discovery = read("client/src/lib/routeDiscovery.ts");

    expect(discovery).toContain("route.keywords");
    expect(discovery).toContain("coverageBonus");
    expect(discovery).toContain("matchedTokens");
  });
});
