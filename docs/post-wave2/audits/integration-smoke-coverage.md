# Integration smoke coverage audit

Scope: maintain low-cost cross-product smoke tests proving that representative Wave-2 producer/consumer contracts can be composed without claiming deployed infrastructure.

## Executable coverage now present

`tests/release/integration-smoke.test.ts` runs in the flagship `pnpm test` gate and now exercises three provider-free cross-product slices.

### Events -> Audit

- SkyEvents normalizes and emits the `sky.events.published.v1` contract;
- the contract is consumed to construct a SkyAudit record;
- sensitive metadata is redacted before the audit boundary;
- replay produces the same deterministic audit id/canonical representation;
- malformed event timestamps fail closed before handoff.

### HopeAI planner -> Messaging

- HopeAI builds a deterministic, integrity-checked agent plan without invoking a model or tool;
- the first dependency-ready planner step is handed to SkyMessaging;
- the HopeAI plan id is used as the message idempotency key;
- replay does not duplicate the message or notification;
- a tampered plan id fails closed before it can drive downstream work.

This proves local TypeScript/domain composition only. It does **not** prove live model inference, autonomous tool execution, external chat transport, realtime delivery, push notifications, persistence, identity verification, or ShadowChat deployment.

### Marketplace -> Checkout -> Wallet planning

- SkyMarketplaceCore creates and activates a deterministic listing;
- SkyCheckout quotes that listing using safe integer minor-unit arithmetic;
- the quote total is converted to a `bigint` wallet transfer intent;
- Sky4 Wallet Engine validates plan integrity and applies local non-mutating debit accounting;
- insufficient local wallet balance fails closed before any debit plan is accepted.

This is a provider-free commerce-intent rehearsal. It does **not** sign or broadcast a transaction, move money, settle an order, reserve inventory, custody keys, connect to a chain, perform tax/compliance processing, or prove payment execution.

## Remaining coverage expansion

Representative live-adapter slices still need direct evidence where those adapters are actually in the deployed release path. Priority candidates remain:

- external AI/model gateway failure behavior and chat transport when configured;
- database-backed persistence and reconnect/retry semantics;
- hosted auth/session persistence;
- payment-provider or blockchain adapters, if/when enabled, with non-production test credentials and strict no-custody boundaries;
- education progress persistence across the deployed API/database path;
- control-plane provider health/timeout behavior;
- deployed telemetry/alert propagation.

Each additional slice should:

- verify contract compatibility at module boundaries;
- avoid external-provider dependencies in the baseline smoke suite;
- assert both success and failure behavior;
- run deterministically in CI;
- document any missing adapter rather than inventing provider behavior.
