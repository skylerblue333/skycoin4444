import { describe, expect, it } from "vitest";
import catalog from "./routeCatalog.json";

describe("generated route catalog", () => {
  it("indexes the complete static interface portfolio", () => {
    expect(catalog.routes.length).toBeGreaterThanOrEqual(1000);
  });

  it("contains unique, absolute route paths", () => {
    const paths = catalog.routes.map(route => route.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every(route => route.startsWith("/"))).toBe(true);
  });

  it("keeps labels and component names searchable", () => {
    expect(catalog.routes.every(route => route.label.length > 0 && route.component.length > 0)).toBe(true);
  });
});
