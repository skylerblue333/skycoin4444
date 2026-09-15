import { describe, expect, it } from "vitest";
import {
  mergeRecentRoutePaths,
  resolveRecentRoutes,
  scoreRoute,
  searchRoutes,
  type DiscoverableRoute,
} from "./routeDiscovery";

const routes: DiscoverableRoute[] = [
  { path: "/activity-feed", label: "Activity Feed", component: "ActivityFeed" },
  { path: "/gaming", label: "Gaming", component: "Gaming" },
  { path: "/game-center", label: "Game Center", component: "GameCenter" },
  { path: "/beta-workspace", label: "Beta Workspace", component: "BetaWorkspace" },
  { path: "/platform-map", label: "Platform Map", component: "PlatformMap" },
];

describe("V3 route discovery", () => {
  it("prioritizes exact and prefix label matches", () => {
    expect(scoreRoute(routes[1], "gaming")).toBeGreaterThan(scoreRoute(routes[2], "game"));
    expect(searchRoutes(routes, "game").map(route => route.path)).toEqual(["/game-center", "/gaming"]);
  });

  it("searches route paths and component names", () => {
    expect(searchRoutes(routes, "workspace")[0]?.path).toBe("/beta-workspace");
    expect(searchRoutes(routes, "activityfeed")[0]?.path).toBe("/activity-feed");
  });

  it("normalizes route separators and whitespace", () => {
    expect(searchRoutes(routes, "platform map")[0]?.path).toBe("/platform-map");
    expect(searchRoutes(routes, "activity feed")[0]?.path).toBe("/activity-feed");
  });

  it("returns no results for an empty query", () => {
    expect(searchRoutes(routes, "   ")).toEqual([]);
  });

  it("keeps recent routes unique and newest first", () => {
    expect(mergeRecentRoutePaths(["/gaming", "/activity-feed"], "/activity-feed")).toEqual([
      "/activity-feed",
      "/gaming",
    ]);
  });

  it("drops stale recent paths that are not in the registry", () => {
    expect(resolveRecentRoutes(routes, ["/missing", "/gaming", "/platform-map"]).map(route => route.path)).toEqual([
      "/gaming",
      "/platform-map",
    ]);
  });
});
