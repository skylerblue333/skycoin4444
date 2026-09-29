# Sky Enterprise Adapters

Typed engineering-beta contracts for enterprise provider integrations.

This package centralizes provider capability metadata, required configuration
names, secret-presence checks, bounded external-execution commands,
runtime-health evidence, and integration-gap reporting.

## Current catalog

The registry currently covers 70+ adapters across identity/SSO, HR, CRM,
support, collaboration, messaging, payments/finance, commerce, object
storage/data warehouses, queues/event streams, observability,
secrets/security, developer tooling, analytics, AI providers, and document
systems.

Examples include Okta, Microsoft Entra ID, WorkOS, Workday, Salesforce,
HubSpot, ServiceNow, Slack, Microsoft Teams, Twilio, SendGrid, Stripe, PayPal,
Plaid, QuickBooks, Shopify, S3, BigQuery, Kafka, SQS, Datadog,
OpenTelemetry, Vault, GitHub, Segment, OpenAI, Google Drive, and SharePoint.

## Provider runtime health gate

`inspectAdapterReadiness` only validates configuration names and secret
presence. It intentionally reports
`externalConnectivityVerified: false` and performs no network call.

A trusted provider executor can pass its sanitized probe result through
`createAdapterRuntimeEvidence`. Live execution must then pass
`evaluateAdapterExecutionGate` or `assertAdapterLiveExecutionReady`.

The gate fails closed when:

- required configuration is missing;
- no runtime evidence exists;
- the evidence belongs to a different adapter;
- the provider is degraded or failed;
- a caller tries to label a provider healthy without an authenticated network
  probe;
- health evidence is stale;
- health evidence is implausibly far in the future.

Freshness is deterministic and caller-configurable, with a five-minute default.
This prevents a provider that was healthy once from being treated as healthy
forever.

## Security and truth boundary

- credentials are never returned by readiness inspection;
- unknown configuration keys fail closed;
- missing required configuration remains `unconfigured`;
- command payloads are bounded and reject unsafe object keys;
- adapter commands are execution intents only and always report
  `networkCallPerformed: false`;
- `ready-for-external-execution` means required configuration names are
  present, **not** that credentials are valid or provider connectivity
  succeeded;
- runtime evidence is a contract for a trusted executor; this package does not
  itself perform or independently attest a provider network call;
- no SSO verification, payment settlement, banking access, external delivery,
  cloud persistence, AI connectivity, or compliance certification is claimed.

Provider executors should remain separate behind reviewed allowlists,
outbound-network policy, timeout/retry/circuit-breaker controls, credential
isolation, audit events, and exact-head CI.
