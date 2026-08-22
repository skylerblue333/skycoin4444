# SKYCOIN4444 Monorepo Boundary

The existing application remains the canonical production asset. The monorepo layer is additive and starts with two small shared packages:

- `@skycoin/contracts` contains validated, reusable platform contracts and integration-state guards.
- `@skycoin/area-registry` records ownership, status, and source-of-truth evidence for the first 30 areas.

Area repositories are not treated as production-ready merely because they exist. An area can move from `planned` or `integrating` to `implemented` only after its code is linked, tests pass, and external integrations are verified. Financial, blockchain, and AI integrations must report `test` or `unavailable` when live evidence is absent.

This first migration intentionally does not move client pages, database migrations, credentials, or wallet secrets. Those require area-by-area review and a reversible migration PR.
