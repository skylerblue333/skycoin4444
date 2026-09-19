# Provider Runtime Health Contract

Status: engineering beta shared-platform contract

This contract prevents SKYCOIN4444 product surfaces from treating configuration or credential presence as proof that an external capability is operational. It is shared infrastructure for HopeAI, Video, SkyLive, payments, blockchain, email/SMS, notifications, media processing, and any future provider-backed capability.

## Runtime states

- `test` — explicitly configured test adapter. It may only satisfy test execution intent.
- `pending` — configuration exists, but authentication and/or runtime health evidence is incomplete.
- `live` — configuration exists, the adapter has authenticated successfully, and a runtime health check timestamp is present.
- `failed` — the adapter attempted setup or operation and failed. A user-safe reason is required.
- `unavailable` — the adapter is not configured or cannot currently be used. A user-safe reason is required.

These states are intentionally distinct. UI code must not collapse `test`, `pending`, `failed`, or `unavailable` into a generic connected/online badge.

## Fail-closed rules

`createProviderRuntimeReport` rejects impossible or misleading claims:

1. `live` requires `configured: true`.
2. `live` requires `authenticated: true`.
3. `live` requires `lastHealthCheckAt`.
4. `authenticated: true` is invalid when `configured: false`.
5. A latency measurement is invalid without a health-check timestamp.
6. `pending`, `failed`, and `unavailable` require a bounded user-safe reason.
7. `test` requires explicit configuration and never satisfies live execution intent.
8. Provider identifiers and capabilities are bounded safe identifiers.

`isProviderCallable(report, "live")` is the canonical execution guard for live provider actions. Product code must check it immediately before provider-backed execution rather than relying on UI state.

## API

Authenticated users can read the sanitized runtime inventory at the tRPC route:

`system.providerHealth.list`

The response contains provider state, capability identifiers, last health-check metadata, and explicit `liveCallable` / `testCallable` flags. It never returns provider URLs, API keys, authorization headers, cookies, or other credentials.

The current built-in Forge adapter remains `pending` even when both existing Forge environment variables are present because credential presence has not yet been verified by an authenticated runtime health probe. With missing/incomplete configuration it is `unavailable`.

## Integration contract for product areas

Provider-backed features should follow this sequence:

1. Resolve the registered provider runtime report.
2. Check the exact execution intent (`live` or `test`).
3. If the provider is not callable, render the matching pending/failed/unavailable state and do not invoke it.
4. If callable, perform the provider action through its typed adapter.
5. Record provider errors without leaking credentials or raw sensitive payloads.
6. Update runtime health only from verified adapter results.

A product area must not create its own looser interpretation of provider readiness.

## Current limitations

- This change defines the shared domain contract and exposes the existing Forge configuration boundary; it does not implement external network health probes.
- No AI model, payment processor, custody provider, blockchain signer, streaming ingest provider, email/SMS provider, malware scanner, or video provider is newly connected by this change.
- No provider is promoted to `live` by environment configuration alone.
- Runtime provider state is not persisted; future adapters should write health evidence through a dedicated observability store if durable history is required.
- This is an engineering-beta control, not a production-readiness or security certification.

## Migration and rollback

There is no database migration. Existing product routes are unchanged.

Rollback is a normal Git revert of the commits adding the provider runtime contract, provider-health router, system-router mount, tests, and this document. No persisted data requires cleanup.
