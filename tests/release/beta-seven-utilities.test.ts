import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  analyzePassword,
  buildMonthGrid,
  clampMenuPosition,
  countText,
  dateDistanceDays,
  normalizeDateOnly,
  transformText,
} from "../../client/src/lib/betaFormUtilities";

const pagePaths = {
  dateInput: "client/src/pages/DateInputForm.tsx",
  datePicker: "client/src/pages/DatePickerDialog.tsx",
  password: "client/src/pages/PasswordInputForm.tsx",
  textInput: "client/src/pages/TextInputForm.tsx",
  textTools: "client/src/pages/TextTools.tsx",
  contextMenu: "client/src/pages/ContextMenu.tsx",
  guidelines: "client/src/pages/CommunityGuidelines.tsx",
} as const;

const sources = Object.fromEntries(
  Object.entries(pagePaths).map(([key, path]) => [
    key,
    fs.readFileSync(path, "utf8"),
  ])
) as Record<keyof typeof pagePaths, string>;


const registry = JSON.parse(
  fs.readFileSync("catalogs/beta-route-evidence.json", "utf8")
) as {
  routes: Array<{
    route: string;
    capability: string;
    evidence: string[];
    boundary: string;
  }>;
};

const inventory = JSON.parse(
  fs.readFileSync("catalogs/screen-inventory.json", "utf8")
) as {
  counts: Record<string, number>;
  routes: Array<{
    path: string;
    readiness: string;
    requiresAuth: boolean;
  }>;
};

const promotedRoutes = [
  "/date-input-form",
  "/date-picker-dialog",
  "/password-input-form",
  "/text-input-form",
  "/text-tools",
  "/context-menu",
  "/community-guidelines",
] as const;

describe("beta seven utility core", () => {
  it("counts and transforms text deterministically", () => {
    expect(countText("one two\nthree")).toEqual({
      characters: 13,
      charactersNoSpaces: 11,
      words: 3,
      lines: 2,
    });
    expect(transformText("sky COIN", "uppercase")).toBe("SKY COIN");
    expect(transformText("sky COIN", "lowercase")).toBe("sky coin");
    expect(transformText("sky coin beta", "title-case")).toBe("Sky Coin Beta");
    expect(transformText("b\na\na", "sort-lines")).toBe("a\na\nb");
    expect(transformText("b\na\na", "dedupe-lines")).toBe("b\na");
  });

  it("validates date-only values and builds stable month grids", () => {
    expect(normalizeDateOnly("2026-09-04")).toBe("2026-09-04");
    expect(normalizeDateOnly("2026-02-30")).toBeNull();
    expect(dateDistanceDays("2026-09-01", "2026-09-04")).toBe(3);

    const september = buildMonthGrid(2026, 8);
    expect(september).toHaveLength(42);
    expect(september.filter(cell => cell.inMonth)).toHaveLength(30);
    expect(september.find(cell => cell.inMonth)?.date).toBe("2026-09-01");
  });

  it("analyzes passwords transparently and clamps context menus", () => {
    expect(analyzePassword("")).toMatchObject({
      score: 0,
      label: "empty",
    });
    expect(analyzePassword("Skycoin4444!Beta")).toMatchObject({
      score: 4,
      label: "strong",
    });
    expect(clampMenuPosition(999, 999, 800, 600)).toEqual({
      x: 572,
      y: 412,
    });
    expect(clampMenuPosition(-20, -5, 800, 600)).toEqual({
      x: 8,
      y: 8,
    });
  });
});

describe("beta seven utility pages", () => {
  it("replaces every generated shell with meaningful interactions", () => {
    for (const source of Object.values(sources)) {
      expect(source).not.toMatch(
        /No data available\. Start by creating a new item/i
      );
      expect(source).not.toMatch(/Content for .* page/i);
      expect(source).not.toMatch(/feature coming soon/i);
      expect(source).not.toMatch(/Deactivate.*Activate|Activate.*Deactivate/s);
    }

    expect(sources.dateInput).toContain("dateDistanceDays");
    expect(sources.datePicker).toContain("buildMonthGrid");
    expect(sources.password).toContain("analyzePassword");
    expect(sources.textInput).toContain("countText");
    expect(sources.textTools).toContain("transformText");
    expect(sources.contextMenu).toContain("clampMenuPosition");
  });

  it("states explicit local/provider/security boundaries", () => {
    expect(sources.dateInput).toMatch(
      /No appointment booking, reminder delivery, calendar sync, or server persistence/i
    );
    expect(sources.datePicker).toMatch(
      /No event creation, calendar provider integration, reminder scheduling, or booking/i
    );
    expect(sources.password).toMatch(
      /not a security guarantee, breach check, credential manager, authentication flow/i
    );
    expect(sources.textInput).toMatch(
      /client-side validation only; it does not submit, save/i
    );
    expect(sources.textTools).toMatch(
      /No AI rewriting, translation provider, cloud sync, or server processing/i
    );
    expect(sources.contextMenu).toMatch(
      /does not modify files, browser settings, account data, or operating-system context menus/i
    );
  });

  it("turns community guidelines into a searchable safety and reporting surface", () => {
    expect(sources.guidelines).toMatch(/Treat people with dignity/);
    expect(sources.guidelines).toMatch(/Protect privacy/);
    expect(sources.guidelines).toMatch(/No scams or deceptive commerce/);
    expect(sources.guidelines).toMatch(/No instructions for serious harm/);
    expect(sources.guidelines).toMatch(/Use beta labels honestly/);
    expect(sources.guidelines).toContain("/beta-feedback");
    expect(sources.guidelines).toContain("/privacy-settings");
    expect(sources.guidelines).toMatch(
      /not a claim of legal or regulatory certification/i
    );
    expect(sources.guidelines).toMatch(
      /Emergency response and law-enforcement services are not provided/i
    );
  });


  it("records all seven promotions with synchronized evidence and inventory", () => {
    const evidenceByRoute = new Map(
      registry.routes.map(entry => [entry.route, entry])
    );
    const inventoryByPath = new Map(
      inventory.routes.map(entry => [entry.path, entry])
    );

    expect(registry.routes).toHaveLength(67);
    expect(inventory.counts).toEqual({
      launchable_beta: 67,
      legacy_unverified: 937,
      controlled_or_unavailable: 64,
    });

    for (const route of promotedRoutes) {
      expect(inventoryByPath.get(route)).toMatchObject({
        readiness: "launchable_beta",
        requiresAuth: false,
      });
      expect(evidenceByRoute.get(route)?.capability.length).toBeGreaterThan(20);
      expect(evidenceByRoute.get(route)?.evidence.length).toBeGreaterThanOrEqual(
        3
      );
      expect(evidenceByRoute.get(route)?.boundary.length).toBeGreaterThan(25);
    }
  });
});
