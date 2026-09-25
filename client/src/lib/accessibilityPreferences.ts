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
    try {
      window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(normalized));
    } catch {
      // Preference changes should still apply for this session when storage is blocked.
    }
    notifyAccessibilityPreferenceChange();
  }
  return normalized;
}

export function resetAccessibilityPreferences() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(ACCESSIBILITY_STORAGE_KEY);
    } catch {
      // Reset should remain non-fatal when browser storage is unavailable.
    }
    notifyAccessibilityPreferenceChange();
  }
  return defaultAccessibilityPreview;
}
