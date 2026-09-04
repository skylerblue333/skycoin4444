import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  calculateArithmetic,
  convertText,
  countWords,
  nextFloorTablePosition,
  normalizeAccessibilityPreview,
  normalizeCalendarEvents,
  normalizeFloorTables,
  searchBetaRoutes,
  validateCalendarEvent,
} from "../../client/src/lib/betaUtilities";

const registry = JSON.parse(
  fs.readFileSync("catalogs/beta-route-evidence.json", "utf8")
);
const inventory = JSON.parse(
  fs.readFileSync("catalogs/screen-inventory.json", "utf8")
);
const pages = Object.fromEntries(
  [
    ["calculator", "client/src/pages/Calculator.tsx"],
    ["calendar", "client/src/pages/Calendar.tsx"],
    ["help", "client/src/pages/HelpCenter.tsx"],
    ["accessibility", "client/src/pages/AccessibilitySettings.tsx"],
    ["converter", "client/src/pages/FileConverter.tsx"],
    ["blog", "client/src/pages/BlogEditor.tsx"],
    ["search", "client/src/pages/AdvancedSearch.tsx"],
    ["event", "client/src/pages/EventPlanner.tsx"],
  ].map(([key, path]) => [key, fs.readFileSync(path, "utf8")])
);

const promotedRoutes = [
  "/calculator",
  "/calendar",
  "/help-center",
  "/accessibility-settings",
  "/file-converter",
  "/blog-editor",
  "/advanced-search",
  "/event-planner",
];

describe("beta promotion batch 01", () => {
  it("supports deterministic arithmetic without eval", () => {
    expect(calculateArithmetic(8, 2, "add")).toBe(10);
    expect(calculateArithmetic(8, 2, "subtract")).toBe(6);
    expect(calculateArithmetic(8, 2, "multiply")).toBe(16);
    expect(calculateArithmetic(8, 2, "divide")).toBe(4);
    expect(() => calculateArithmetic(8, 0, "divide")).toThrow(/divide by zero/i);
    expect(pages.calculator).not.toMatch(/eval\(|No data available/);
  });

  it("validates and restores local calendar events", () => {
    expect(
      validateCalendarEvent({
        title: "Beta review",
        date: "2026-09-04",
        notes: "Check promoted routes",
      })
    ).toEqual([]);
    expect(
      validateCalendarEvent({ title: "x", date: "not-a-date" })
    ).toHaveLength(2);
    expect(
      normalizeCalendarEvents([
        {
          id: "1",
          title: "Review",
          date: "2026-09-04",
          notes: "",
          completed: false,
        },
        { broken: true },
      ])
    ).toHaveLength(1);
    expect(pages.calendar).toMatch(/localStorage\.setItem/);
    expect(pages.calendar).toMatch(/Nothing syncs to Google Calendar/);
  });

  it("converts supported text formats locally", () => {
    expect(convertText('{"b":2}', "json-pretty")).toContain("\n");
    expect(convertText("a,b\n1,2", "csv-to-tsv")).toBe("a\tb\n1\t2");
    expect(convertText("Sky", "lowercase")).toBe("sky");
    expect(pages.converter).toMatch(/new FileReader\(\)/);
    expect(pages.converter).toMatch(/are not uploaded\s+to a server/);
  });

  it("counts words and keeps blog drafts local", () => {
    expect(countWords("one two\nthree")).toBe(3);
    expect(countWords("   ")).toBe(0);
    expect(pages.blog).toMatch(/localStorage\.setItem/);
    expect(pages.blog).toMatch(/Nothing is published/);
  });

  it("normalizes accessibility preview preferences", () => {
    expect(
      normalizeAccessibilityPreview({
        textScale: 125,
        highContrast: true,
        reducedMotion: true,
        underlineLinks: false,
      })
    ).toEqual({
      textScale: 125,
      highContrast: true,
      reducedMotion: true,
      underlineLinks: false,
    });
    expect(
      normalizeAccessibilityPreview({ textScale: 999 }).textScale
    ).toBe(100);
    expect(pages.accessibility).toMatch(/do not certify WCAG/i);
  });

  it("keeps event-planner geometry deterministic and local", () => {
    expect(nextFloorTablePosition(0)).toEqual({ x: 70, y: 90 });
    expect(nextFloorTablePosition(4)).toEqual({ x: 220, y: 210 });
    expect(
      normalizeFloorTables([
        {
          id: "t",
          x: -10,
          y: 900,
          label: "Table",
          seats: 99,
          color: "bg-blue-500",
        },
      ])
    ).toEqual([
      {
        id: "t",
        x: 0,
        y: 420,
        label: "Table",
        seats: 20,
        color: "bg-blue-500",
      },
    ]);
    expect(pages.event).toMatch(/getBoundingClientRect/);
    expect(pages.event).not.toMatch(/Math\.random|Real-time sync|Auto-syncing|IndexedDB/);
    expect(pages.event).toMatch(/no real-time sync/i);
  });

  it("provides searchable help and beta-route discovery", () => {
    const sample = [
      {
        route: "/one",
        capability: "Alpha unique utility",
        persistence: "None",
        boundary: "No external provider.",
      },
      {
        route: "/two",
        capability: "Beta unique utility",
        persistence: "None",
        boundary: "No external provider.",
      },
    ];
    expect(searchBetaRoutes(sample, "Alpha unique")).toHaveLength(1);
    expect(pages.help).toMatch(/Search verified beta guidance/);
    expect(pages.search).toMatch(/Search the evidence-backed launchable beta registry/);
    expect(pages.help).not.toMatch(/live-support agent.*available/i);
  });

  it("records all eight promotions with evidence and synchronized inventory", () => {
    const routeEvidence = new Map(
      registry.routes.map((entry: { route: string }) => [entry.route, entry])
    );
    const inventoryByRoute = new Map(
      inventory.routes.map((entry: { path: string }) => [entry.path, entry])
    );

    expect(registry.routes).toHaveLength(49);
    expect(inventory.counts).toEqual({
      launchable_beta: 49,
      legacy_unverified: 955,
      controlled_or_unavailable: 64,
    });

    for (const route of promotedRoutes) {
      const evidence = routeEvidence.get(route) as
        | {
            capability?: string;
            boundary?: string;
            evidence?: unknown[];
          }
        | undefined;
      expect(evidence?.capability?.length).toBeGreaterThan(10);
      expect(evidence?.boundary?.length).toBeGreaterThan(20);
      expect(evidence?.evidence?.length).toBeGreaterThan(0);
      expect(
        (inventoryByRoute.get(route) as { readiness?: string } | undefined)
          ?.readiness
      ).toBe("launchable_beta");
    }
  });

  it("removes generated shell markers from every promoted page", () => {
    for (const source of Object.values(pages)) {
      expect(source).not.toMatch(/No data available\. Start by creating a new item\./);
      expect(source).not.toMatch(/Content for .* page/);
      expect(source).not.toMatch(/feature coming soon/i);
    }
  });
});
