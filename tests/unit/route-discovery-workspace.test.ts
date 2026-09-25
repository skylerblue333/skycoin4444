import { describe, expect, it } from "vitest";
import {
  mergeRecentRoutePaths,
  mergeRouteCollections,
  resolveFavoriteRoutes,
  searchRoutes,
  toggleFavoriteRoutePath,
  type DiscoverableRoute,
} from "../../client/src/lib/routeDiscovery";

const routes: DiscoverableRoute[] = [
  {
    path: "/wallet-overview",
    label: "Wallet Overview",
    component: "WalletOverview",
    keywords: ["Wallet & Web3", "crypto portfolio money"],
  },
  {
    path: "/activity-feed",
    label: "Activity Feed",
    component: "ActivityFeed",
    keywords: ["Social", "friends community posts"],
  },
  {
    path: "/sky-school",
    label: "SkySchool",
    component: "SkySchool",
    keywords: ["education courses quizzes learning"],
  },
];

describe("routeDiscovery workspace helpers", () => {
  it("matches multi-word capability searches across route and area keywords", () => {
    expect(searchRoutes(routes, "crypto wallet", 3)[0]?.path).toBe("/wallet-overview");
    expect(searchRoutes(routes, "community friends", 3)[0]?.path).toBe("/activity-feed");
    expect(searchRoutes(routes, "courses learning", 3)[0]?.path).toBe("/sky-school");
  });

  it("keeps recent routes unique and bounded", () => {
    const recent = mergeRecentRoutePaths(
      ["/activity-feed", "/wallet-overview", "/sky-school"],
      "/wallet-overview",
      2,
    );
    expect(recent).toEqual(["/wallet-overview", "/activity-feed"]);
  });

  it("toggles favorites without duplicating routes and respects the cap", () => {
    expect(toggleFavoriteRoutePath([], "/wallet-overview")).toEqual(["/wallet-overview"]);
    expect(toggleFavoriteRoutePath(["/wallet-overview"], "/wallet-overview")).toEqual([]);
    expect(
      toggleFavoriteRoutePath(["/activity-feed", "/sky-school"], "/wallet-overview", 2),
    ).toEqual(["/wallet-overview", "/activity-feed"]);
  });

  it("resolves favorite routes in saved order and ignores stale paths", () => {
    expect(
      resolveFavoriteRoutes(routes, ["/sky-school", "/missing", "/activity-feed"]).map(
        route => route.path,
      ),
    ).toEqual(["/sky-school", "/activity-feed"]);
  });

  it("merges route collections in priority order without duplicates", () => {
    const merged = mergeRouteCollections(
      [[routes[0], routes[1]], [routes[1], routes[2]]],
      3,
    );
    expect(merged.map(route => route.path)).toEqual([
      "/wallet-overview",
      "/activity-feed",
      "/sky-school",
    ]);
  });
});
