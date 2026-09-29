# Enterprise Adapter Architecture

## Why this exists

SKYCOIN4444 already has internal domain contracts for CRM, webhooks, queues,
storage, observability, events, identity/security, commerce, and finance. The
enterprise adapter layer describes which external providers could satisfy
normalized capabilities without pretending those providers are already
connected.

`packages/sky-enterprise-adapters` fills that gap.

## Normalized capability map

- SSO / directory: OIDC, SAML, SCIM, directory users;
- workforce: people and payroll;
- CRM / support: contacts, deals, tickets;
- collaboration / notifications: chat, meetings, email, SMS;
- financial: checkout, billing, account connectivity, accounting ledger;
- commerce: catalog and orders;
- platform: object storage, warehouse SQL, queues and streams;
- operations: metrics, traces, logs, secrets and alerts;
- developer / analytics: source, CI, product events and marketing automation;
- AI / documents: inference and enterprise file systems;
- webhooks: inbound and outbound integration boundaries.

## Execution model

The registry performs no provider network calls. It produces
`sky.enterprise-adapter.command.v1` intents for a future dedicated executor.
This keeps domain code deterministic and testable while making the external
side effect explicit.

A provider executor should require:

1. provider-specific destination allowlists;
2. connection and read timeouts;
3. bounded retries with jitter and circuit breaking;
4. idempotency for writes where supported;
5. credential isolation and rotation;
6. webhook signature verification;
7. event/audit emission into the existing event fabric;
8. rate-limit and back-pressure handling;
9. tenant isolation;
10. dead-letter and replay policy.

## Runtime health contract

Configuration is not runtime health.

`inspectAdapterReadiness` answers only whether required configuration names
are present. It never returns secret values, performs no network calls, and
always reports external connectivity as unverified.

A trusted executor may normalize a provider probe with
`createAdapterRuntimeEvidence`. The evidence contract distinguishes:

- `configured`: configuration exists, but no network health claim is made;
- `healthy`: an authenticated runtime probe completed successfully;
- `degraded`: a probe completed but the provider is not fully healthy;
- `failed`: the runtime probe failed.

`evaluateAdapterExecutionGate` allows live external execution only when the
adapter is configured and the exact adapter has fresh `healthy` evidence.
The default evidence lifetime is five minutes. Stale or implausibly
future-dated evidence fails closed.

This package validates evidence shape and freshness. It does not itself prove
that a network call occurred; only trusted provider-executor code should create
runtime evidence after the provider-specific probe has actually run.

## Gap reporting

`assessIntegrationCoverage` classifies required capabilities as
`configured`, `catalog-only`, or `missing`. A `configured` coverage
result remains configuration-level evidence only and is not a live-health
claim.

## Recommended first execution adapters

The highest-value executor candidates are identity (Okta / Entra ID / WorkOS),
notifications (SendGrid / Twilio), observability (OpenTelemetry / Sentry /
Datadog), storage (S3), CRM (Salesforce / HubSpot), and payments (Stripe /
PayPal).

Identity and financial integrations must remain fail-closed until their
security, audit, operational, and provider-specific verification evidence is
complete.
