import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "../..");
const APP_PATH = path.join(ROOT, "client/src/App.tsx");
const ROUTE_CATALOG_PATH = path.join(ROOT, "client/src/data/routeCatalog.json");
const ROOT_SHELL_PATHS = new Set([
  "/",
  "/404",
  "/beta-catalog",
  "/beta-commerce",
  "/beta-feedback",
  "/beta-journey",
  "/beta-web3",
  "/beta-workspace",
  "/discovery-center",
  "/home",
  "/not-found",
  "/operational-readiness",
  "/route-health",
]);
const BUCKETS = [
  ["AF", /^[a-f]/],
  ["GL", /^[g-l]/],
  ["MR", /^[m-r]/],
  ["SZ", /^[s-z]/],
  ["Other", /^[^a-z]/],
] as const;

function routePaths(source: string): string[] {
  return [...source.matchAll(/<Route path="([^"]+)"/g)].map(match => match[1]);
}

describe("legacy route partition", () => {
  it("keeps every legacy route exactly once across the path buckets", () => {
    const allPaths: string[] = [];

    for (const [name, expectedPrefix] of BUCKETS) {
      const source = readFileSync(
        path.join(ROOT, `client/src/routes/legacy/LegacyRoutes${name}.tsx`),
        "utf8"
      );
      const paths = routePaths(source);
      for (const routePath of paths) {
        const first = routePath.replace(/^\/+/, "").charAt(0).toLowerCase();
        expect(first).toMatch(expectedPrefix);
      }
      allPaths.push(...paths);
    }

    const catalog = JSON.parse(readFileSync(ROUTE_CATALOG_PATH, "utf8")) as {
      routes: Array<{ path: string }>;
    };
    const legacyCatalogPaths = catalog.routes
      .map(route => route.path)
      .filter(routePath => !ROOT_SHELL_PATHS.has(routePath));

    expect(new Set(allPaths).size).toBe(allPaths.length);
    expect(new Set(legacyCatalogPaths).size).toBe(legacyCatalogPaths.length);
    expect([...allPaths].sort()).toEqual([...legacyCatalogPaths].sort());
  });

  it("keeps the root application shell small and delegates the catalog", () => {
    const source = readFileSync(APP_PATH, "utf8");

    expect(source).toContain('import LegacyRouteSwitch from "./routes/LegacyRouteSwitch"');
    expect(source).not.toContain("lazy(() => import('./pages/");
    expect(routePaths(source)).toHaveLength(13);
    expect((source.match(/<Route\b/g) ?? [])).toHaveLength(14);
  });
});
