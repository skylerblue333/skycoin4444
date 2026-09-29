import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  resetAccessibilityPreferences,
  saveAccessibilityPreferences,
} from "../../client/src/lib/accessibilityPreferences";

const helper = readFileSync("client/src/lib/accessibilityPreferences.ts", "utf8");
const runtime = readFileSync("client/src/components/GlobalExperienceRuntime.tsx", "utf8");
const page = readFileSync("client/src/pages/AccessibilitySettings.tsx", "utf8");
const css = readFileSync("client/src/index.css", "utf8");

describe("global browser-local accessibility preferences", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function installBlockedStorageBrowser() {
    const classes = new Set<string>();
    const classList = {
      add: (...names: string[]) => names.forEach(name => classes.add(name)),
      remove: (...names: string[]) => names.forEach(name => classes.delete(name)),
    };
    const dispatchEvent = vi.fn();

    vi.stubGlobal("document", {
      documentElement: { classList },
    });
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("storage blocked");
        },
        setItem: () => {
          throw new Error("storage blocked");
        },
        removeItem: () => {
          throw new Error("storage blocked");
        },
      },
      dispatchEvent,
    });

    return { classes, dispatchEvent };
  }

  it("applies preferences from the shared runtime across the routed app", () => {
    expect(runtime).toContain("applyAccessibilityPreferences");
    expect(runtime).toContain("loadAccessibilityPreferences");
    expect(runtime).toContain("ACCESSIBILITY_PREFERENCES_EVENT");
    expect(runtime).toContain('window.addEventListener("storage"');
  });

  it("keeps storage failures non-fatal and applies the selection for the session", () => {
    const { classes, dispatchEvent } = installBlockedStorageBrowser();

    expect(() =>
      saveAccessibilityPreferences({
        textScale: 150,
        highContrast: true,
        reducedMotion: true,
        underlineLinks: true,
      })
    ).not.toThrow();

    expect(classes).toEqual(
      new Set([
        "sky-a11y-scale-150",
        "sky-a11y-high-contrast",
        "sky-a11y-reduced-motion",
        "sky-a11y-underline-links",
      ])
    );
    expect(dispatchEvent).not.toHaveBeenCalled();
  });

  it("resets the in-memory preference even when persistent storage is blocked", () => {
    const { classes, dispatchEvent } = installBlockedStorageBrowser();

    saveAccessibilityPreferences({
      textScale: 150,
      highContrast: true,
      reducedMotion: true,
      underlineLinks: true,
    });
    expect(() => resetAccessibilityPreferences()).not.toThrow();

    expect(classes).toEqual(new Set(["sky-a11y-scale-100"]));
    expect(dispatchEvent).not.toHaveBeenCalled();
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
