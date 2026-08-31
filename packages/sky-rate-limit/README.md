# SkyRateLimit — Slot #169

SkyRateLimit is an engineering-beta deterministic rate-limit policy/domain core. It evaluates caller-supplied event timestamps inside a fixed rolling window and returns an allow/block decision with remaining capacity and retry timing.

## SKYCOIN4444 integration contract

API gateways, messaging, auth, and workflow adapters may supply authenticated subject IDs plus persisted request observations to `evaluateRateLimit`. This package does not store events or enforce network traffic itself.

## Security and truth boundaries

Identifiers and integer time/policy values are validated and future observations fail closed. Distributed counters, atomic persistence, multi-region consistency, trusted clocks, abuse detection, transport enforcement, and production infrastructure remain integration responsibilities.

## Validation

`pnpm --filter @skycoin/sky-rate-limit test`, package TypeScript checks, repository build/test gates, formatting, and the production dependency audit are expected before merge.
