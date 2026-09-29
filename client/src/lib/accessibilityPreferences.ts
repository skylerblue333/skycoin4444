import {
  defaultAccessibilityPreview,
  normalizeAccessibilityPreview,
  type AccessibilityPreview,
} from "@/lib/betaUtilities";

export const ACCESSIBILITY_STORAGE_KEY = "sky4444.beta-accessibility-preview";
export const ACCESSIBILITY_PREFERENCES_EVENT = "sky4444:accessibility-preferences-changed";

const SCALE_CLASSES = [
  "sky-a11y-scale-100",
  "sky-a11y-scale-110",
  "sky-a11y-scale-125",
  "sky-a11y-scale-150",
] as const;

export function loadAccessibilityPreferences(): AccessibilityPreview {
  if (typeof window === "undefined") return defaultAccessibilityPreview;
  try {
    return normalizeAccessibilityPreview(
      JSON.parse(window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY) ?? "{}"),
    );
  } catch {
    return defaultAccessibilityPreview;
  }
}

export function accessibilityPreferenceClasses(settings: AccessibilityPreview) {
  return [
    `sky-a11y-scale-${settings.textScale}`,
    settings.highContrast ? "sky-a11y-high-contrast" : "",
    settings.reducedMotion ? "sky-a11y-reduced-motion" : "",
    settings.underlineLinks ? "sky-a11y-underline-links" : "",
  ].filter(Boolean);
}

export function applyAccessibilityPreferences(settings: AccessibilityPreview) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.classList.remove(
    ...SCALE_CLASSES,
    "sky-a11y-high-contrast",
    "sky-a11y-reduced-motion",
    "sky-a11y-underline-links",
  );
  root.classList.add(...accessibilityPreferenceClasses(settings));
}

function notifyAccessibilityPreferenceChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ACCESSIBILITY_PREFERENCES_EVENT));
}

export function saveAccessibilityPreferences(next: AccessibilityPreview) {
  const normalized = normalizeAccessibilityPreview(next);
  if (typeof window !== "undefined") {
    let persisted = false;
    try {
      window.localStorage.setItem(
        ACCESSIBILITY_STORAGE_KEY,
        JSON.stringify(normalized)
      );
      persisted = true;
    } catch {
      // Keep the preference usable for this browser session even when
      // persistence is blocked.
    }

    applyAccessibilityPreferences(normalized);

    // The shared runtime reloads from storage when this event fires. Do not
    // dispatch it after a failed write, or the runtime would immediately
    // overwrite the in-memory preference with the stored/default value.
    if (persisted) {
      notifyAccessibilityPreferenceChange();
    }
  }
  return normalized;
}

export function resetAccessibilityPreferences() {
  if (typeof window !== "undefined") {
    let persistenceReset = false;
    try {
      window.localStorage.removeItem(ACCESSIBILITY_STORAGE_KEY);
      persistenceReset = true;
    } catch {
      // Keep reset non-fatal and apply the default for this session even when
      // persistent browser storage cannot be changed.
    }

    applyAccessibilityPreferences(defaultAccessibilityPreview);

    if (persistenceReset) {
      notifyAccessibilityPreferenceChange();
    }
  }
  return defaultAccessibilityPreview;
}
