# SKYCOIN4444 Universal UI/UX Experience Layer

## Purpose

The beta contains more than 1,000 routed screens. This layer improves the shared experience instead of attempting to hand-polish every route independently.

## Delivered in this increment

- A universal route workspace reachable with `Ctrl/⌘ K` or `/`.
- Multi-word search across screen labels, route paths, component names, product-area names, and product-area search terms.
- Device-local favorites for frequently used screens.
- Device-local recent-route history that updates from normal navigation, not only command-palette clicks.
- Area-aware related-screen suggestions using the canonical beta experience map.
- Visible beta-surface status context such as Core beta, Controlled beta, Preview, or Library route.
- Keyboard wraparound with Up/Down + Enter.
- Focus capture/restore and a tab loop for the modal workspace.
- Combobox/listbox semantics and active-option announcements for assistive technology.

## Product boundary

This is a navigation and usability layer. It does not make every legacy route functionally complete, does not create missing backend/provider integrations, and does not upgrade preview screens into production-certified capabilities.

Favorites and recents are intentionally stored in browser local storage in this increment. They are convenience preferences, not durable cross-device account data.

## Why this scales

The workspace reads from `routeCatalog.json` and `betaExperienceAreas.ts`, so newly registered screens automatically become searchable and inherit product-area context without requiring one-off command-palette code.

This supports the current 1,000+ screen library while keeping the route registry and truthful beta status map as the sources of truth.
