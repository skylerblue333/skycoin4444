# Frontend Bundle Budget

Status: engineering-beta release gate.

The routed client contains more than one thousand lazily loaded pages. Keeping those page modules lazy is not enough if the route registry and shared dependencies are parsed as one oversized startup chunk, so the release build now gates both concerns.

## Build contract

- Vite 8 / Rolldown splits shared dependencies into bounded vendor groups.
- The generated legacy route registry is partitioned into path buckets; only the bucket for the current path is requested.
- The existing Vite **500 kB** warning threshold is not raised or disabled.
- Every local JavaScript file referenced by the generated HTML as a module entry or `modulepreload` must remain at or below **500 kB uncompressed**.
- `pnpm build` runs `scripts/check-frontend-bundle-budget.mjs` after the production bundle is emitted and fails closed if the initial graph cannot be identified or any initial JavaScript chunk exceeds the budget.
- Vendor groups use a 350 kB maximum split target and preserve source execution order.

The 500 kB initial-chunk gate is a regression budget, not a promise about network transfer time or device performance. Compression, caching, route-specific chunks, runtime CPU cost, and real-user Core Web Vitals require separate measurement.

## Route-partition truth boundary

The partition only changes how the existing exact literal routes are registered and loaded. It does not add new product capabilities, and it does not turn placeholder or engineering-beta pages into production services.

## Rollback

No data migration or runtime persistence is involved. Revert the route partition, Vite chunking configuration, package postbuild hook, budget script, tests, and this document together.
