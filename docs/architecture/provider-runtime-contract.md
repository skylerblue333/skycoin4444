# Provider Runtime Health Contract

## Purpose

Provider configuration and credential presence are necessary inputs, but they
are not proof that an external provider is reachable, authenticated, healthy,
or safe to call.

The enterprise adapter runtime-health contract adds a fail-closed execution
gate without introducing provider-specific network calls into the shared
registry.

## Contract

The shared adapter package exposes three layers:

1. `inspectAdapterReadiness` validates required configuration names while
   keeping credential values secret.
2. `createAdapterRuntimeEvidence` sanitizes a trusted executor's runtime probe
   result and prevents impossible state combinations.
3. `evaluateAdapterExecutionGate` and
   `assertAdapterLiveExecutionReady` require fresh healthy evidence before a
   live external call is allowed.

A `healthy` runtime observation must record:

- the exact known adapter;
- an authenticated provider result;
- a completed network probe;
- a parseable probe timestamp;
- no failure reason.

`degraded` and `failed` observations require a completed probe and bounded
failure reason. A `configured` observation cannot claim authentication,
network activity, latency, or health.

## Freshness

The default maximum evidence age is five minutes, with a 30-second future-clock
skew allowance. Callers can choose tighter bounds for high-risk providers.

Evidence that is stale or too far in the future is blocked. This prevents a
historical success from becoming an indefinite live-provider claim.

## Security boundary

The shared package performs no network calls and does not independently attest
that a probe occurred. Runtime evidence must be created only by trusted,
provider-specific executor code after the actual health/authentication check.

Secrets are not included in readiness or runtime evidence, must never be copied into probe reasons, and should remain isolated in the provider executor. Provider executors
still need destination allowlists, timeout/retry/circuit-breaker policy,
credential isolation, tenant isolation, webhook verification, idempotency,
audit events, and rate-limit handling.

## Product boundary

This contract does not establish live AI connectivity, payment settlement,
banking access, cloud persistence, identity verification, notification
delivery, blockchain execution, compliance certification, or production
security assurance.
