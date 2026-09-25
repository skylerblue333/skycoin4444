# Sky Enterprise Adapters

Typed engineering-beta contracts for enterprise provider integrations.

This package centralizes provider capability metadata, required configuration names, secret-presence checks, bounded external-execution commands, and integration-gap reporting. It intentionally performs **no provider network calls** and never treats configuration presence as proof of connectivity.

## Current catalog

The registry currently covers 70+ adapters across identity/SSO, HR, CRM, support, collaboration, messaging, payments/finance, commerce, object storage/data warehouses, queues/event streams, observability, secrets/security, developer tooling, analytics, AI providers, and document systems.

Examples include Okta, Microsoft Entra ID, WorkOS, Workday, Salesforce, HubSpot, ServiceNow, Slack, Microsoft Teams, Twilio, SendGrid, Stripe, PayPal, Plaid, QuickBooks, Shopify, S3, BigQuery, Kafka, SQS, Datadog, OpenTelemetry, Vault, GitHub, Segment, OpenAI, Google Drive, and SharePoint.

## Security and truth boundary

- credentials are never returned by readiness inspection;
- unknown configuration keys fail closed;
- missing required configuration remains `unconfigured`;
- command payloads are bounded and reject unsafe object keys;
- adapter commands are execution intents only and always report `networkCallPerformed: false`;
- `ready-for-external-execution` means required configuration names are present, **not** that credentials are valid or provider connectivity succeeded;
- no SSO verification, payment settlement, banking access, external delivery, cloud persistence, AI connectivity, or compliance certification is claimed.

Provider executors should be implemented separately behind reviewed allowlists, outbound-network policy, timeout/retry/circuit-breaker controls, credential isolation, audit events, and exact-head CI.
