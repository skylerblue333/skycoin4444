import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("global experience runtime release contract", () => {
  it("covers the entire routed beta from the shared app shell", () => {
    const app = read("client/src/App.tsx");
    const catalog = JSON.parse(read("client/src/data/routeCatalog.json")) as {
      routes: Array<{ path: string; label: string; component: string }>;
    };

    expect(catalog.routes.length).toBeGreaterThan(1000);
    expect(app).toContain('import GlobalExperienceRuntime from "./components/GlobalExperienceRuntime"');
    expect(app).toContain("<GlobalExperienceRuntime />");
    expect(app).toContain('id="sky4444-route-content"');
    expect(app).toContain("tabIndex={-1}");
  });

  it("adds route-aware titles and non-disruptive route announcements", () => {
    const source = read("client/src/components/GlobalExperienceRuntime.tsx");

    expect(source).toContain("document.title");
    expect(source).toContain("route.label");
    expect(source).toContain("Opened {route.label}.");
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('aria-atomic="true"');
  });

  it("provides a keyboard skip path without forcing focus on route changes", () => {
    const source = read("client/src/components/GlobalExperienceRuntime.tsx");

    expect(source).toContain('href="#sky4444-route-content"');
    expect(source).toContain("Skip to page content");
    expect(source).not.toContain(".focus()");
  });

  it("truthfully communicates offline limitations instead of claiming offline execution", () => {
    const source = read("client/src/components/GlobalExperienceRuntime.tsx");

    expect(source).toContain("navigator.onLine");
    expect(source).toContain('"online"');
    expect(source).toContain('"offline"');
    expect(source).toContain("Server actions can fail until your connection returns.");
    expect(source).not.toContain("fully works offline");
  });
});
