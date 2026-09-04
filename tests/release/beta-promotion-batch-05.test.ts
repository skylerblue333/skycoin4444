import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildBreadcrumbs,
  buildMonthCells,
  clampProgress,
  filterAndSortRows,
  getPageWindow,
  shiftSupportedMonth,
  tokenizeCodeLine,
} from "../../client/src/lib/betaPresentationLab";

const routes = [
  "/calendar-view",
  "/code-highlighting",
  "/data-grid",
  "/pagination",
  "/progress-bar",
  "/alert-dialog",
  "/breadcrumb-navigation",
  "/code-samples",
] as const;

const pagePaths: Record<(typeof routes)[number], string> = {
  "/calendar-view": "client/src/pages/CalendarView.tsx",
  "/code-highlighting": "client/src/pages/CodeHighlighting.tsx",
  "/data-grid": "client/src/pages/DataGrid.tsx",
  "/pagination": "client/src/pages/Pagination.tsx",
  "/progress-bar": "client/src/pages/ProgressBar.tsx",
  "/alert-dialog": "client/src/pages/AlertDialog.tsx",
  "/breadcrumb-navigation": "client/src/pages/BreadcrumbNavigation.tsx",
  "/code-samples": "client/src/pages/CodeSamples.tsx",
};

const sources = Object.fromEntries(
  routes.map(route => [route, fs.readFileSync(pagePaths[route], "utf8")])
) as Record<(typeof routes)[number], string>;

const registry = JSON.parse(
  fs.readFileSync("catalogs/beta-route-evidence.json", "utf8")
);
const inventory = JSON.parse(
  fs.readFileSync("catalogs/screen-inventory.json", "utf8")
);

describe("beta promotion batch 05 helpers", () => {
  it("builds deterministic month grids", () => {
    const february = buildMonthCells(2028, 1);
    expect(february.filter(cell => cell.day !== null)).toHaveLength(29);
    expect(february.find(cell => cell.day === 29)?.isoDate).toBe("2028-02-29");
    expect(february.length % 7).toBe(0);
    expect(() => buildMonthCells(1969, 0)).toThrow();
    expect(shiftSupportedMonth(1970, 0, -1)).toBeNull();
    expect(shiftSupportedMonth(2100, 11, 1)).toBeNull();
    expect(shiftSupportedMonth(2026, 0, -1)).toEqual({
      year: 2025,
      monthIndex: 11,
    });
  });

  it("tokenizes a bounded code subset without execution", () => {
    const tokens = tokenizeCodeLine('const answer = "ok" // note');
    expect(tokens.some(token => token.kind === "keyword" && token.text === "const")).toBe(true);
    expect(tokens.some(token => token.kind === "string" && token.text === '"ok"')).toBe(true);
    expect(tokens.some(token => token.kind === "comment")).toBe(true);
  });

  it("filters and sorts fixture grid rows", () => {
    const rows = [
      { id: "1", name: "Beta", category: "B", score: 3 },
      { id: "2", name: "Alpha", category: "A", score: 9 },
    ];
    expect(filterAndSortRows(rows, "", "name", "asc").map(row => row.id)).toEqual(["2", "1"]);
    expect(filterAndSortRows(rows, "9", "score", "desc").map(row => row.id)).toEqual(["2"]);
  });

  it("clamps progress and paginates safely", () => {
    expect(clampProgress(-5)).toBe(0);
    expect(clampProgress(105.4)).toBe(100);
    expect(clampProgress(Number.NaN)).toBe(0);
    expect(getPageWindow([1, 2, 3, 4, 5], 9, 2)).toEqual({
      page: 3,
      pageCount: 3,
      items: [5],
    });
  });

  it("normalizes breadcrumb labels and cumulative paths", () => {
    expect(buildBreadcrumbs("/beta-workspace/privacy_settings")).toEqual([
      { label: "Home", path: "/" },
      { label: "Beta Workspace", path: "/beta-workspace" },
      { label: "Privacy Settings", path: "/beta-workspace/privacy_settings" },
    ]);
    expect(buildBreadcrumbs("/settings/%")).toEqual([
      { label: "Home", path: "/" },
      { label: "Settings", path: "/settings" },
      { label: "%", path: "/settings/%" },
    ]);
  });
});

describe("beta promotion batch 05 pages", () => {
  it("removes generated shell and coming-soon markers", () => {
    for (const source of Object.values(sources)) {
      expect(source).not.toMatch(/No data available\. Start by creating a new item/i);
      expect(source).not.toMatch(/Content for .* page/i);
      expect(source).not.toMatch(/feature coming soon/i);
      expect(source).not.toMatch(/\{state \? "Deactivate" : "Activate"\}/);
    }
  });

  it("states truthful local and fixture boundaries", () => {
    expect(sources["/calendar-view"]).toMatch(/No Google\/iCloud sync, event storage, reminders, invitations, or server persistence/i);
    expect(sources["/code-highlighting"]).toMatch(/No code is executed, compiled, linted, sent to an AI provider, or uploaded/i);
    expect(sources["/data-grid"]).toMatch(/fixture values for UI testing, not live quality metrics/i);
    expect(sources["/data-grid"]).toMatch(/No remote database query, analytics service, user data, or production metrics/i);
    expect(sources["/pagination"]).toMatch(/No API pagination, cursor persistence, remote dataset, or account state/i);
    expect(sources["/progress-bar"]).toMatch(/does not infer deployment, business, learning, financial, or user progress/i);
    expect(sources["/alert-dialog"]).toMatch(/No notification service, account mutation, purchase, deletion, payment, or irreversible action/i);
    expect(sources["/breadcrumb-navigation"]).toMatch(/does not change application routing, browser history, permissions, or remote state/i);
    expect(sources["/code-samples"]).toMatch(/does not execute them, provision services, create credentials, or contact external providers/i);
    expect(sources["/calendar-view"]).toMatch(/disabled=\{!previousMonth\}/);
    expect(sources["/calendar-view"]).toMatch(/disabled=\{!nextMonth\}/);
    expect(sources["/alert-dialog"]).toContain('from "@/components/ui/alert-dialog"');
    expect(sources["/alert-dialog"]).toContain("AlertDialogAction");
  });

  it("records all eight promotions with synchronized evidence", () => {
    const evidenceByRoute = new Map(
      registry.routes.map((entry: { route: string }) => [entry.route, entry])
    );
    const inventoryByRoute = new Map(
      inventory.routes.map((entry: { path: string }) => [entry.path, entry])
    );

    expect(registry.routes).toHaveLength(67);
    expect(inventory.counts).toEqual({
      launchable_beta: 67,
      legacy_unverified: 937,
      controlled_or_unavailable: 64,
    });
    const launchablePaths = inventory.routes
      .filter((entry: { readiness: string }) => entry.readiness === "launchable_beta")
      .map((entry: { path: string }) => entry.path);
    expect(inventory.launchableBetaRoutes).toHaveLength(67);
    expect(new Set(inventory.launchableBetaRoutes)).toEqual(
      new Set(launchablePaths)
    );

    for (const route of routes) {
      expect(
        (inventoryByRoute.get(route) as { readiness?: string } | undefined)
          ?.readiness
      ).toBe("launchable_beta");
      const evidence = evidenceByRoute.get(route) as
        | { capability?: string; evidence?: unknown[]; boundary?: string }
        | undefined;
      expect(evidence?.capability?.length).toBeGreaterThan(20);
      expect(evidence?.evidence?.length).toBeGreaterThanOrEqual(3);
      expect(evidence?.boundary?.length).toBeGreaterThan(25);
    }
  });
});
