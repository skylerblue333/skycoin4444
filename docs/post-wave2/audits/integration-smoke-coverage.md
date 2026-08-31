# Integration smoke coverage audit

Scope: maintain low-cost cross-product smoke tests proving that representative Wave-2 producer/consumer contracts can be composed without claiming deployed infrastructure.

## Executable coverage now present

`tests/release/integration-smoke.test.ts` runs in the flagship `pnpm test` gate and exercises a real in-repository producer/consumer boundary:

- SkyEvents normalizes and emits the `sky.events.published.v1` contract;
- the contract is consumed to construct a SkyAudit record;
- sensitive metadata is redacted before the audit boundary;
- replay produces the same deterministic audit id/canonical representation;
- malformed event timestamps fail closed before handoff.

This smoke test is provider-free. It validates TypeScript/domain-contract composition only; it does **not** establish live identity providers, message brokers, durable audit storage, deployed observability, or production infrastructure.

## Remaining coverage expansion

Representative payments, AI, social, education, commerce, Web3, and control-plane producer/consumer slices should be added as concrete in-repository adapters become identifiable. Each additional slice should:

- verify contract compatibility at module boundaries;
- avoid external-provider dependencies in the baseline smoke suite;
- assert both success and failure behavior;
- run deterministically in CI;
- document any missing adapter rather than inventing provider behavior.
