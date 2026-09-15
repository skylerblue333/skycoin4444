import fs from "node:fs";
import { describe, expect, it } from "vitest";
import routeCatalog from "../../client/src/data/routeCatalog.json";
import {
  filterV5Platforms,
  v5Platforms,
} from "../../client/src/lib/v5Platforms";

const workspaceSource = fs.readFileSync(
  "client/src/pages/BetaWorkspace.tsx",
  "utf8"
);
const hubSource = fs.readFileSync(
  "client/src/pages/V5PlatformHub.tsx",
  "utf8"
);

const registeredRoutes = new Set(routeCatalog.routes.map(route => route.path));

describe("V5 ten-platform product hub", () => {
  it("promotes exactly ten distinct flagship platforms", () => {
    expect(v5Platforms).toHaveLength(10);
    expect(new Set(v5Platforms.map(platform => platform.id)).size).toBe(10);
    expect(new Set(v5Platforms.map(platform => platform.route)).size).toBe(10);

    for (const platform of v5Platforms) {
      expect(platform.name.length).toBeGreaterThan(5);
      expect(platform.description.length).toBeGreaterThan(70);
      expect(platform.value.length).toBeGreaterThan(45);
      expect(platform.capabilities.length).toBeGreaterThanOrEqual(3);
      expect(platform.quickActions).toHaveLength(3);
      expect(platform.truth.length).toBeGreaterThan(70);
    }
  });

  it("points every flagship and quick action at a real registered route", () => {
    for (const platform of v5Platforms) {
      expect(registeredRoutes.has(platform.route)).toBe(true);
      for (const action of platform.quickActions) {
        expect(registeredRoutes.has(action.route)).toBe(true);
      }
    }
  });

  it("supports useful flagship discovery instead of route hunting", () => {
    expect(filterV5Platforms("")).toHaveLength(10);
    expect(filterV5Platforms("dating").map(platform => platform.id)).toContain(
      "dating"
    );
    expect(filterV5Platforms("creator").map(platform => platform.id)).toContain(
      "creator"
    );
    expect(filterV5Platforms("wallet").map(platform => platform.id)).toContain(
      "web3"
    );
  });

  it("makes V5 the product-first beta workspace and keeps truth boundaries", () => {
    expect(workspaceSource).toMatch(/<V5PlatformHub\s*\/>/);
    expect(workspaceSource).toMatch(/Reality checks, not platform locks/);
    expect(hubSource).toMatch(/10 flagship platforms/);
    expect(hubSource).toMatch(/30.*direct quick actions/);
    expect(hubSource).toMatch(/0.*platform demo locks/);
    expect(hubSource).toMatch(/Open demo, protected actions/);
    expect(hubSource).toMatch(/Browse every public demo surface immediately/);
  });
});
