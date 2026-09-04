import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  countSelected,
  filterDemoRecords,
  normalizeSingleChoice,
  sortDemoRecords,
  toggleUnique,
} from "../../client/src/lib/betaInteractionLab";

const routes = [
  "/accordion-navigation",
  "/data-table",
  "/dropdown-menu",
  "/empty-search-state",
  "/multi-select-form",
  "/radio-button-form",
  "/select-dropdown-form",
  "/tabs-navigation",
] as const;

const pagePaths: Record<(typeof routes)[number], string> = {
  "/accordion-navigation": "client/src/pages/AccordionNavigation.tsx",
  "/data-table": "client/src/pages/DataTable.tsx",
  "/dropdown-menu": "client/src/pages/DropdownMenu.tsx",
  "/empty-search-state": "client/src/pages/EmptySearchState.tsx",
  "/multi-select-form": "client/src/pages/MultiSelectForm.tsx",
  "/radio-button-form": "client/src/pages/RadioButtonForm.tsx",
  "/select-dropdown-form": "client/src/pages/SelectDropdownForm.tsx",
  "/tabs-navigation": "client/src/pages/TabsNavigation.tsx",
};

const sources = Object.fromEntries(
  routes.map(route => [route, fs.readFileSync(pagePaths[route], "utf8")])
) as Record<(typeof routes)[number], string>;

describe("beta promotion batch 06 helpers", () => {
  const records = [
    { id: "1", label: "Beta", group: "Navigation", detail: "Workspace" },
    { id: "2", label: "Privacy", group: "Safety", detail: "Controls" },
  ];

  it("filters and sorts fixture records deterministically", () => {
    expect(filterDemoRecords(records, "safe").map(record => record.id)).toEqual(["2"]);
    expect(sortDemoRecords(records, "label", "asc").map(record => record.id)).toEqual(["1", "2"]);
    expect(sortDemoRecords(records, "group", "desc").map(record => record.id)).toEqual(["2", "1"]);
  });

  it("maintains unique multi-select values", () => {
    expect(toggleUnique(["Social"], "Gaming")).toEqual(["Social", "Gaming"]);
    expect(toggleUnique(["Social", "Gaming"], "Social")).toEqual(["Gaming"]);
    expect(countSelected(["Social", "Social", "Unknown"], ["Social", "Gaming"])).toBe(1);
  });

  it("normalizes bounded single-choice values", () => {
    expect(normalizeSingleChoice("bug", ["bug", "feedback"], "feedback")).toBe("bug");
    expect(normalizeSingleChoice("admin", ["bug", "feedback"], "feedback")).toBe("feedback");
  });
});

describe("beta promotion batch 06 pages", () => {
  it("removes generated shell markers", () => {
    for (const source of Object.values(sources)) {
      expect(source).not.toMatch(/Content for .* page/i);
      expect(source).not.toMatch(/\{state \? "Deactivate" : "Activate"\}/);
      expect(source).not.toMatch(/No data available\. Start by creating a new item/i);
      expect(source).not.toMatch(/feature coming soon/i);
    }
  });

  it("states truthful local-interaction boundaries", () => {
    expect(sources["/accordion-navigation"]).toMatch(/does not change routes, permissions, account state, or remote navigation configuration/i);
    expect(sources["/data-table"]).toMatch(/No remote query, pagination API, user data, analytics pipeline, or production metric/i);
    expect(sources["/dropdown-menu"]).toMatch(/No file, account, archive, delete, permission, or server action is actually performed/i);
    expect(sources["/empty-search-state"]).toMatch(/No search history, personalization, external index, AI retrieval, or server request/i);
    expect(sources["/multi-select-form"]).toMatch(/not submitted, saved to an account, synchronized, or used for personalization/i);
    expect(sources["/radio-button-form"]).toMatch(/No preference is persisted, synchronized, submitted, or applied/i);
    expect(sources["/select-dropdown-form"]).toMatch(/No support ticket, feedback record, notification, or server request/i);
    expect(sources["/tabs-navigation"]).toMatch(/does not alter browser history, application routes, account state, or remote configuration/i);
  });

  it("uses shared interaction components for accordion, dropdown, and tabs", () => {
    expect(sources["/accordion-navigation"]).toContain('from "@/components/ui/accordion"');
    expect(sources["/dropdown-menu"]).toContain('from "@/components/ui/dropdown-menu"');
    expect(sources["/tabs-navigation"]).toContain('from "@/components/ui/tabs"');
  });
});
