# Global Interaction Accessibility Baseline

## Scope

This increment improves interaction accessibility at the shared stylesheet level so both modern flagship experiences and older routed screens inherit the same minimum behavior.

## Delivered

- Honors the operating system `prefers-reduced-motion: reduce` preference.
- Collapses animation and transition durations rather than leaving large motion effects active.
- Disables smooth scrolling under reduced-motion preference.
- Adds a visible focus outline for links, buttons, inputs, selects, textareas, and explicitly focusable elements.
- Preserves a system-color focus indicator when forced-colors mode is active.

## Boundary

This is a baseline, not a claim of complete WCAG conformance. Individual screens still need semantic structure, correct labels, logical tab order, media alternatives, chart/table accessibility, contrast review, and workflow-specific testing.

Reduced motion also does not mean all visual change disappears; state changes and essential content remain visible, with motion duration minimized.
