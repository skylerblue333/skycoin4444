# Failure semantics audit

Scope: validation and lifecycle failures that can be proven from the current in-repository engineering-beta boundaries.

## Evidence reviewed

- `packages/sky-events/src/index.ts` / `index.test.ts`: invalid identifiers, zone-less instants, impossible calendar dates, invalid offsets, and invalid filter instants throw explicit validation errors before publication/filtering.
- `packages/sky-audit/src/index.ts` / `index.test.ts`: invalid audit fields and invalid instants throw before canonical record creation; sensitive metadata is redacted case-insensitively.
- `tests/release/integration-smoke.test.ts`: malformed producer timestamps fail before the SkyEvents -> SkyAudit handoff; successful replay yields the same deterministic audit identity.
- `client/src/const.ts`: missing or malformed OAuth configuration routes to an explicit local unavailable state instead of constructing an invalid provider URL.

## Current findings

- Representative event/audit validation failures are explicit and fail closed rather than silently normalizing invalid calendar values.
- The provider-free integration smoke distinguishes valid handoff from producer validation failure.
- Unconfigured OAuth has an explicit unavailable boundary instead of a fake provider success path.
- The reviewed domain cores use thrown validation errors rather than returning success-shaped records for invalid inputs.

## Remaining limits

This evidence does not classify network/provider failures as retryable versus permanent because no live broker, OAuth provider, database, payment rail, or external service is exercised by this baseline audit. Additional lifecycle modules should be added to the evidence set when concrete failure contracts/adapters are identified.
