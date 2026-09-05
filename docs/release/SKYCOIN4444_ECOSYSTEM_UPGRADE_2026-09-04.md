# SKYCOIN4444 Ecosystem Upgrade — 2026-09-04

This release advances the engineering beta without changing the repository’s production-boundary claims.

## Cross-module beta reference

The synced beta reference now has a persistent device-local activity ledger shared by SkySchool, SkyMarket, and the simulated wallet. Completing a lesson records a demo SKY reward, marketplace checkout records a demo purchase debit, and wallet transfers validate the available balance and record the transfer. Responsive mobile layouts and keyboard focus states were also added. The reference build and its five smoke tests pass.

These flows remain explicitly simulated and do not represent custody, payment settlement, blockchain execution, or production persistence.

## Canonical application

The canonical `ActivityFeed` surface now exposes an explicit refresh control. The control uses the existing query lifecycle, disables while fetching, announces its purpose for assistive technology, and shows a progress animation while the live feed is being refreshed. Search and feed loading/error/empty states remain unchanged.

## Verification

The synced beta reference passed:

- `npm test`
- production build
- 5 tests passed, 0 failed

The canonical workspace should be validated with the repository’s normal CI-equivalent commands before beta promotion:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm run check:packages
pnpm test
pnpm run build
```

## Boundaries

No secrets, external providers, payments, custody, or production deployment settings were added by this upgrade. The canonical repository remains an engineering beta and must retain its fail-closed security and financial boundaries.

## Follow-up polish batch

The platform dashboard now applies report scope consistently across activity charts, language rankings, and language distribution. Date-range and language filters can be cleared in one action, and exports include the selected scope, a timestamp, a spreadsheet-compatible UTF-8 marker, and sanitized filenames. Screen-reader status messaging and labeled controls make scope changes and downloads discoverable without relying on visual cues.

The live Activity Feed now provides a clear-search action, an explicit search label, and result-count messaging that includes the active query. These changes remain client-side presentation improvements over the existing live database-backed feed and do not alter authentication or persistence boundaries.
