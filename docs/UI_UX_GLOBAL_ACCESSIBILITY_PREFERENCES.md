# Global Accessibility Preferences

## Purpose

The existing Accessibility Settings screen previously stored preferences only for its local preview. This increment makes those browser-local preferences affect the shared routed application.

## Preferences

- Text scale: 100%, 110%, 125%, or 150%.
- Higher-contrast design-token override.
- Reduced-motion override in addition to the operating-system reduced-motion baseline.
- Underlined links.

## Persistence and failure behavior

Preferences are stored in browser local storage. They are not account-scoped and do not sync across devices.

If local storage is unavailable or blocked, the settings interaction remains non-fatal. The app keeps operating and the selected preference can still be applied for the current runtime event where possible.

## Accessibility boundary

These controls improve usability but do not certify the application, any individual route, or the historical screen inventory as WCAG conformant. Per-screen semantic, keyboard, contrast, media, chart/table, error, and workflow testing is still required.
