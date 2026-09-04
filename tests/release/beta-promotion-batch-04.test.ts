import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  confirmationMatches,
  formatJsonSource,
  normalizePlainText,
  sortContentPlanItems,
  toggleSelection,
  validateContentPlanItem,
  validateLocalContact,
} from "../../client/src/lib/betaUtilityLab";

const routes = [
  "/code-formatter",
  "/content-calendar",
  "/address-book",
  "/checkbox-group-form",
  "/confirmation-dialog",
  "/component-showcase",
] as const;

const pagePaths: Record<(typeof routes)[number], string> = {
  "/code-formatter": "client/src/pages/CodeFormatter.tsx",
  "/content-calendar": "client/src/pages/ContentCalendar.tsx",
  "/address-book": "client/src/pages/AddressBook.tsx",
  "/checkbox-group-form": "client/src/pages/CheckboxGroupForm.tsx",
  "/confirmation-dialog": "client/src/pages/ConfirmationDialog.tsx",
  "/component-showcase": "client/src/pages/ComponentShowcase.tsx",
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

describe("beta promotion batch 04 helpers", () => {
  it("formats JSON and normalizes plain text deterministically", () => {
    expect(formatJsonSource('{"b":2,"a":1}', 2)).toBe(
      '{\n  "b": 2,\n  "a": 1\n}'
    );
    expect(() => formatJsonSource("{broken", 2)).toThrow();
    expect(normalizePlainText("a   \n\n\n b\t\n")).toBe("a\n\n b");
  });

  it("validates and sorts content calendar items", () => {
    expect(
      validateContentPlanItem({
        title: "Launch note",
        channel: "social",
        date: "2026-09-04",
        status: "draft",
      })
    ).toEqual([]);
    expect(
      validateContentPlanItem({
        title: "x",
        channel: "",
        date: "09/04/2026",
        status: "idea",
      })
    ).toHaveLength(3);
    expect(
      sortContentPlanItems([
        { id: "2", title: "B", channel: "x", date: "2026-09-05", status: "idea" },
        { id: "1", title: "A", channel: "x", date: "2026-09-04", status: "ready" },
      ]).map(item => item.id)
    ).toEqual(["1", "2"]);
  });

  it("validates local contacts and deterministic selection helpers", () => {
    expect(
      validateLocalContact({
        name: "Ada",
        email: "ada@example.com",
        phone: "555-0100",
        note: "Beta tester",
      })
    ).toEqual([]);
    expect(
      validateLocalContact({
        name: "x",
        email: "not-an-email",
        phone: "",
        note: "",
      })
    ).toHaveLength(2);
    expect(toggleSelection(["Social"], "Gaming")).toEqual(["Social", "Gaming"]);
    expect(toggleSelection(["Social", "Gaming"], "Social")).toEqual(["Gaming"]);
    expect(confirmationMatches(" CONFIRM BETA ACTION ", "CONFIRM BETA ACTION")).toBe(true);
  });
});

describe("beta promotion batch 04 pages", () => {
  it("removes generated shell markers from all rewritten pages", () => {
    for (const route of routes.slice(0, 5)) {
      expect(sources[route]).not.toMatch(/No data available\. Start by creating a new item/i);
      expect(sources[route]).not.toMatch(/Content for .* page/i);
      expect(sources[route]).not.toMatch(/\{state \? "Deactivate" : "Activate"\}/);
    }
  });

  it("states truthful local/provider boundaries", () => {
    expect(sources["/code-formatter"]).toMatch(/not a compiler, linter, transpiler, IDE, or server-backed/i);
    expect(sources["/content-calendar"]).toMatch(/No scheduling API, social publishing, collaboration, analytics, or server sync/i);
    expect(sources["/address-book"]).toMatch(/No address lookup, messaging, CRM sync, device-contact sync, or server persistence/i);
    expect(sources["/checkbox-group-form"]).toMatch(/not saved, submitted, synchronized, or used for personalization/i);
    expect(sources["/confirmation-dialog"]).toMatch(/No account deletion, purchase, payment, server mutation, or irreversible operation/i);
    expect(sources["/component-showcase"]).toMatch(/local canned demo response/i);
    expect(sources["/component-showcase"]).toMatch(/does not contact an AI\s+provider/i);
  });

  it("records all six promotions with synchronized inventory evidence", () => {
    const evidenceByRoute = new Map(
      registry.routes.map((entry: { route: string }) => [entry.route, entry])
    );
    const inventoryByRoute = new Map(
      inventory.routes.map((entry: { path: string }) => [entry.path, entry])
    );

    expect(registry.routes).toHaveLength(59);
    expect(inventory.counts).toEqual({
      launchable_beta: 59,
      legacy_unverified: 945,
      controlled_or_unavailable: 64,
    });

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
