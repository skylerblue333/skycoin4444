# Enterprise Adapter Architecture

## Why this exists

SKYCOIN4444 already has internal domain contracts for CRM, webhooks, queues, storage, observability, events, identity/security, commerce, and finance. The missing enterprise layer was a single place to describe which external providers could satisfy which normalized capabilities without pretending those providers were already connected.

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

The registry performs no provider network calls. It produces `sky.enterprise-adapter.command.v1` intents for a future dedicated executor. This keeps domain code deterministic and testable while making the external side effect explicit.

A future provider executor should require:

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

## Gap reporting

`assessIntegrationCoverage` classifies required capabilities as `configured`, `catalog-only`, or `missing`. Configuration presence does not prove provider connectivity; live verification belongs in provider-specific, side-effect-safe credential smoke tests.

## Recommended first execution adapters

The highest-value next executors are identity (Okta / Entra ID / WorkOS), notifications (SendGrid / Twilio), observability (OpenTelemetry / Sentry / Datadog), storage (S3), CRM (Salesforce / HubSpot), and payments (Stripe / PayPal).

Identity and financial integrations must remain fail-closed until their security, audit, operational, and provider-specific verification evidence is complete.
