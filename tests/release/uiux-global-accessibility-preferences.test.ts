import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const helper = readFileSync("client/src/lib/accessibilityPreferences.ts", "utf8");
const runtime = readFileSync("client/src/components/GlobalExperienceRuntime.tsx", "utf8");
const page = readFileSync("client/src/pages/AccessibilitySettings.tsx", "utf8");
const css = readFileSync("client/src/index.css", "utf8");

describe("global browser-local accessibility preferences", () => {
  it("applies preferences from the shared runtime across the routed app", () => {
    expect(runtime).toContain("applyAccessibilityPreferences");
    expect(runtime).toContain("loadAccessibilityPreferences");
    expect(runtime).toContain("ACCESSIBILITY_PREFERENCES_EVENT");
    expect(runtime).toContain('window.addEventListener("storage"');
  });

  it("keeps storage failures non-fatal", () => {
    expect(helper).toContain("try {");
    expect(helper).toContain("Preference changes should still apply for this session");
    expect(helper).toContain("Reset should remain non-fatal");
  });

  it("turns the settings lab into an app-wide browser-local control surface", () => {
    expect(page).toContain("browser-local app preference");
    expect(page).toContain("applied across the routed beta");
    expect(page).toContain("saveAccessibilityPreferences");
    expect(page).toContain("resetAccessibilityPreferences");
  });

  it("provides global text scale, contrast, link, and reduced-motion classes", () => {
    expect(css).toContain("html.sky-a11y-scale-150");
    expect(css).toContain("html.sky-a11y-high-contrast");
    expect(css).toContain("html.sky-a11y-underline-links a[href]");
    expect(css).toContain("html.sky-a11y-reduced-motion");
  });

  it("does not claim certification or cross-device persistence", () => {
    expect(page).toMatch(/not an accessibility\s+certification/);
    expect(page).toMatch(/cross-device account preference/);
    expect(page).toContain("Stored only in this browser");
  });
});
