import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  countWords,
  isValidDateKey,
  matchesSearch,
  moveBoardItem,
  sortAssignments,
  type AssignmentItem,
  type BoardItem,
} from "../../client/src/lib/betaPlanning";

const paths = {
  assignments: "client/src/pages/AssignmentTracker.tsx",
  document: "client/src/pages/DocumentEditor.tsx",
  board: "client/src/pages/ProjectBoard.tsx",
} as const;

const sources = Object.fromEntries(
  Object.entries(paths).map(([key, path]) => [key, fs.readFileSync(path, "utf8")]),
) as Record<keyof typeof paths, string>;

const registry = JSON.parse(
  fs.readFileSync("catalogs/beta-route-evidence.json", "utf8"),
) as {
  routes: Array<{
    route: string;
    capability: string;
    evidence: string[];
    boundary: string;
  }>;
};

const inventory = JSON.parse(
  fs.readFileSync("catalogs/screen-inventory.json", "utf8"),
) as {
  counts: Record<string, number>;
  routes: Array<{
    path: string;
    readiness: string;
    requiresAuth: boolean;
  }>;
};

const promotedRoutes = [
  "/assignment-tracker",
  "/document-editor",
  "/project-board",
] as const;

describe("beta promotion batch 03 planning utilities", () => {
  it("sorts assignments by completion, due date, and priority", () => {
    const items: AssignmentItem[] = [
      {
        id: "done",
        title: "Done",
        course: "A",
        dueDate: "2026-09-01",
        priority: "high",
        completed: true,
        createdAt: "2026-09-01T00:00:00.000Z",
      },
      {
        id: "later",
        title: "Later",
        course: "B",
        dueDate: "2026-09-05",
        priority: "low",
        completed: false,
        createdAt: "2026-09-01T00:00:00.000Z",
      },
      {
        id: "sooner",
        title: "Sooner",
        course: "C",
        dueDate: "2026-09-03",
        priority: "medium",
        completed: false,
        createdAt: "2026-09-01T00:00:00.000Z",
      },
    ];

    expect(sortAssignments(items).map(item => item.id)).toEqual([
      "sooner",
      "later",
      "done",
    ]);
  });

  it("searches across local planning fields and moves board items immutably", () => {
    expect(matchesSearch("math", ["Final project", "Math 201"])).toBe(true);
    expect(matchesSearch("biology", ["Final project", "Math 201"])).toBe(false);

    const board: BoardItem[] = [
      {
        id: "task-1",
        title: "Ship",
        detail: "Beta",
        status: "todo",
        createdAt: "2026-09-01T00:00:00.000Z",
      },
    ];

    const moved = moveBoardItem(board, "task-1", "done");
    expect(moved[0].status).toBe("done");
    expect(board[0].status).toBe("todo");
  });

  it("counts words and validates local date keys", () => {
    expect(countWords(" one   two\nthree ")).toBe(3);
    expect(countWords("")).toBe(0);
    expect(isValidDateKey("2026-09-03")).toBe(true);
    expect(isValidDateKey("2026-02-30")).toBe(false);
    expect(isValidDateKey("09/03/2026")).toBe(false);
  });
});

describe("beta promotion batch 03 pages", () => {
  it("replaces generated shells across all promoted pages", () => {
    for (const source of Object.values(sources)) {
      expect(source).not.toMatch(/No data available\. Start by creating a new item/i);
      expect(source).not.toMatch(/Content for .* page/i);
      expect(source).not.toMatch(/feature coming soon/i);
    }
  });

  it("keeps every promoted tool truthful about browser-local persistence", () => {
    expect(sources.assignments).toMatch(/No school system, reminders, shared assignment, or server sync/i);
    expect(sources.document).toMatch(/No account sync, cloud backup, real-time collaboration/i);
    expect(sources.board).toMatch(/No account sync, shared assignment, team presence/i);
  });

  it("records all promotions with synchronized evidence and inventory", () => {
    const evidenceByRoute = new Map(registry.routes.map(entry => [entry.route, entry]));
    const inventoryByPath = new Map(inventory.routes.map(entry => [entry.path, entry]));

    expect(registry.routes).toHaveLength(46);
    expect(inventory.counts).toEqual({
      launchable_beta: 46,
      legacy_unverified: 958,
      controlled_or_unavailable: 64,
    });

    for (const route of promotedRoutes) {
      expect(inventoryByPath.get(route)).toMatchObject({
        readiness: "launchable_beta",
        requiresAuth: false,
      });
      expect(evidenceByRoute.get(route)?.capability.length).toBeGreaterThan(20);
      expect(evidenceByRoute.get(route)?.evidence.length).toBeGreaterThanOrEqual(3);
      expect(evidenceByRoute.get(route)?.boundary.length).toBeGreaterThan(25);
    }
  });
});
