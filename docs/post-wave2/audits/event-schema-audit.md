# Event schema audit

Scope: event producers and their payload contracts, with evidence limited to in-repository engineering-beta behavior.

## Evidence reviewed

- `packages/sky-events/src/index.ts` defines the normalized `SkyEvent` boundary and the versioned provider-neutral `sky.events.published.v1` contract.
- `packages/sky-events/src/index.test.ts` verifies identifier normalization, deterministic ordering, explicit-offset normalization, strict rejection of impossible calendar dates and malformed offsets, filter-boundary validation, and the versioned published contract.
- `tests/release/integration-smoke.test.ts` consumes `sky.events.published.v1` through the SkyAudit boundary and checks deterministic replay plus sensitive-metadata redaction.

## Current findings

- Event names and identifiers are bounded and normalized before publication.
- Published timestamps require an explicit UTC zone/offset and are normalized to canonical UTC ISO strings.
- Impossible calendar dates and invalid offsets fail closed rather than relying on JavaScript `Date` normalization.
- Equal-time event ordering uses explicit code-unit comparison rather than locale-sensitive ordering.
- The representative published-event contract is explicitly versioned as `sky.events.published.v1` and has executable producer/consumer coverage.

## Remaining limits

This audit does not prove a live message broker, durable event log, cross-service schema registry, delivery guarantees, replay infrastructure, or deployed compatibility across external repositories. Additional event-producing modules should be added to the evidence set when concrete adapters are available.
