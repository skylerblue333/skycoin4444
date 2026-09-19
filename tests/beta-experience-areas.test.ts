import { describe, expect, it } from "vitest";
import routeCatalog from "../client/src/data/routeCatalog.json";
import {
  betaExperienceAreas,
  resolveBetaRouteContext,
} from "../client/src/data/betaExperienceAreas";

const registeredRoutes = new Set(routeCatalog.routes.map(route => route.path));

describe("beta experience areas", () => {
  it("uses unique area ids and primary routes", () => {
    const ids = betaExperienceAreas.map(area => area.id);
    const routes = betaExperienceAreas.map(area => area.route);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("keeps every primary area entry point in the generated route catalog", () => {
    const missing = betaExperienceAreas
      .filter(area => !registeredRoutes.has(area.route))
      .map(area => `${area.name}: ${area.route}`);

    expect(missing).toEqual([]);
  });

  it("keeps every highlighted destination in the generated route catalog", () => {
    const missing = betaExperienceAreas.flatMap(area =>
      area.highlights
        .filter(link => !registeredRoutes.has(link.route))
        .map(link => `${area.name} > ${link.label}: ${link.route}`)
    );

    expect(missing).toEqual([]);
  });

  it("does not present controlled areas as unrestricted production services", () => {
    const controlledIds = new Set([
      "hopeai",
      "wallet-web3",
      "marketplace",
      "enterprise",
      "investor",
      "impact",
      "trust-safety",
    ]);

    const misclassified = betaExperienceAreas
      .filter(area => controlledIds.has(area.id) && area.status !== "controlled_beta")
      .map(area => area.id);

    expect(misclassified).toEqual([]);
  });

  it("gives representative deep routes a coherent parent area", () => {
    expect(resolveBetaRouteContext("/wallet-overview", "Wallet Overview").parentLabel).toBe(
      "Wallet & Web3"
    );
    expect(resolveBetaRouteContext("/video-editor", "Video Editor").parentLabel).toBe(
      "Creator Studio"
    );
    expect(resolveBetaRouteContext("/security-dashboard", "Security Dashboard").parentLabel).toBe(
      "Trust, Safety & Accessibility"
    );
    expect(resolveBetaRouteContext("/campaign-analytics", "Campaign Analytics").parentLabel).toBe(
      "Analytics"
    );
  });

  it("gives every registered route a safe parent destination", () => {
    const invalid = routeCatalog.routes
      .map(route => ({
        route: route.path,
        context: resolveBetaRouteContext(route.path, route.label),
      }))
      .filter(
        item =>
          !registeredRoutes.has(item.context.parentRoute) &&
          item.context.parentRoute !== "/platform-map"
      );

    expect(invalid).toEqual([]);
  });
});
