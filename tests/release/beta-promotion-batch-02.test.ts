import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  hexToRgb,
  normalizeHexColor,
  parseMarkdownBlocks,
  scoreQuiz,
  validateQuizQuestion,
} from "../../client/src/lib/betaProductivity";

const paths = {
  notes: "client/src/pages/NotesApp.tsx",
  todo: "client/src/pages/TodoList.tsx",
  color: "client/src/pages/ColorPickerDialog.tsx",
  markdown: "client/src/pages/MarkdownRendering.tsx",
  survey: "client/src/pages/SatisfactionSurvey.tsx",
  theme: "client/src/pages/ThemeSettings.tsx",
  quiz: "client/src/pages/QuizBuilder.tsx",
  about: "client/src/pages/About.tsx",
} as const;

const sources = Object.fromEntries(
  Object.entries(paths).map(([key, path]) => [key, fs.readFileSync(path, "utf8")])
) as Record<keyof typeof paths, string>;

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
  "/notes-app",
  "/todo-list",
  "/color-picker-dialog",
  "/markdown-rendering",
  "/satisfaction-survey",
  "/theme-settings",
  "/quiz-builder",
  "/about",
] as const;

describe("beta promotion batch 02 utilities", () => {
  it("normalizes and converts hex colors deterministically", () => {
    expect(normalizeHexColor("#abc")).toBe("#AABBCC");
    expect(normalizeHexColor("12ef90")).toBe("#12EF90");
    expect(normalizeHexColor("#12xz90")).toBeNull();
    expect(hexToRgb("#FF8000")).toEqual({ r: 255, g: 128, b: 0 });
  });

  it("parses the safe markdown subset without executing HTML", () => {
    const blocks = parseMarkdownBlocks(
      [
        "# Heading",
        "- item",
        "> quote",
        "```js",
        "<script>alert(1)</script>",
        "```",
        "<img src=x onerror=alert(1)>",
      ].join("\n")
    );

    expect(blocks).toEqual([
      { type: "heading", level: 1, text: "Heading" },
      { type: "list", text: "item" },
      { type: "quote", text: "quote" },
      { type: "code", text: "<script>alert(1)</script>" },
      { type: "paragraph", text: "<img src=x onerror=alert(1)>" },
    ]);
    expect(sources.markdown).not.toMatch(/dangerouslySetInnerHTML/);
    expect(sources.markdown).toMatch(/raw HTML and JavaScript are never executed/i);
  });

  it("validates and scores local quizzes deterministically", () => {
    expect(
      validateQuizQuestion({
        prompt: "2 + 2?",
        options: ["3", "4"],
        correctIndex: 1,
      })
    ).toBeNull();

    expect(
      validateQuizQuestion({
        prompt: "x",
        options: ["", "4"],
        correctIndex: 4,
      })
    ).toBeTruthy();

    expect(
      scoreQuiz(
        [
          { prompt: "Q1", options: ["A", "B"], correctIndex: 0 },
          { prompt: "Q2", options: ["A", "B"], correctIndex: 1 },
        ],
        { 0: 0, 1: 0 }
      )
    ).toEqual({ correct: 1, total: 2, percent: 50 });
  });
});

describe("beta promotion batch 02 pages", () => {
  it("replaces generated shells and coming-soon markers across all eight pages", () => {
    for (const source of Object.values(sources)) {
      expect(source).not.toMatch(/No data available\. Start by creating a new item/i);
      expect(source).not.toMatch(/Content for .* page/i);
      expect(source).not.toMatch(/feature coming soon/i);
      expect(source).not.toMatch(/\{state \? "Deactivate" : "Activate"\}/);
    }
  });

  it("keeps each productivity tool truthful about local persistence or provider limits", () => {
    expect(sources.notes).toMatch(/No account sync, collaboration, cloud backup, or server persistence/i);
    expect(sources.todo).toMatch(/No reminders, shared assignment, server sync, or calendar integration/i);
    expect(sources.color).toMatch(/No cloud palette sync, design-system publishing, or external color API/i);
    expect(sources.markdown).toMatch(/raw HTML and JavaScript are never executed/i);
    expect(sources.survey).toMatch(/entries never leave this browser/i);
    expect(sources.theme).toMatch(/No account-level theme sync or cross-device preference service/i);
    expect(sources.quiz).toMatch(/do not issue certificates,\s+grades,\s+credentials,\s+or instructor analytics/i);
  });

  it("records all eight promotions with synchronized evidence and inventory", () => {
    const evidenceByRoute = new Map(
      registry.routes.map(entry => [entry.route, entry])
    );
    const inventoryByPath = new Map(
      inventory.routes.map(entry => [entry.path, entry])
    );

    expect(registry.routes).toHaveLength(54);
    expect(inventory.counts).toEqual({
      launchable_beta: 54,
      legacy_unverified: 950,
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

  it("removes fabricated About claims and states the real beta boundary", () => {
    for (const unsupported of [
      /48,200\+/,
      /2\.4M\+/,
      /\$127K\+/,
      /890K\+/,
      /Watch & Earn/i,
      /Mine Crypto/i,
      /Gaming for Charity/i,
      /real cryptocurrency/i,
      /44 specialized agents/i,
      /ICO launch/i,
      /Full DeFi suite/i,
      /10K users/i,
      /30K users/i,
      /48K\+ active users/i,
      /on-chain certificates/i,
    ]) {
      expect(sources.about).not.toMatch(unsupported);
    }

    expect(sources.about).toMatch(/Evidence before claims/);
    expect(sources.about).toMatch(/No live banking, payment settlement, custody, signing, or token payouts/i);
    expect(sources.about).toMatch(/Deployment remains a separate evidence gate/i);
  });

  it("uses separate accessible controls for saved color selection and deletion", () => {
    expect(sources.color).toMatch(/aria-label=\{"Select saved color " \+ saved\}/);
    expect(sources.color).toMatch(/aria-label=\{"Remove saved color " \+ saved\}/);
    expect(sources.color).not.toMatch(/<span\s+role="button"/);
  });
});
