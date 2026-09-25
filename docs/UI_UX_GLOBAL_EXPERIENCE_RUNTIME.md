# Global Experience Runtime

## Goal

SKYCOIN4444 has a very large routed UI surface. The shared experience runtime adds behavior that should be consistent everywhere instead of depending on each screen to implement it independently.

## Delivered

- Route-aware browser titles derived from the canonical route catalog.
- A polite screen-reader announcement when navigation changes.
- A keyboard-visible **Skip to page content** link.
- A shared focusable route-content target without forcing focus changes during ordinary navigation.
- Browser online/offline observation.
- A truthful offline banner explaining that already-loaded or browser-local content may remain visible while server actions can fail.
- Coverage at the shared `App.tsx` shell so the behavior applies across the routed library.

## Accessibility boundary

The skip link and route announcement improve cross-screen navigation, but they do not certify every legacy screen as fully WCAG conformant. Individual controls, forms, tables, charts, media, and workflows still require their own semantic and interaction review.

## Offline boundary

The runtime does not claim offline transaction execution, offline durable sync, or offline provider access. It only reports the browser connection signal and communicates a conservative degraded-mode expectation.

## Product boundary

This is an engineering-beta UX capability. It does not turn preview routes into production-certified features or create missing backend, payment, custody, blockchain, identity, AI-provider, or external-service integrations.
