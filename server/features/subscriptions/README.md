# SkySubscriptions (#75)

SkySubscriptions is a bounded, provider-neutral subscription-domain core for SKYCOIN4444. It validates plans and subscriptions, computes recurring totals using integer minor units, enforces deterministic lifecycle transitions, supports period-end cancellation intent, and emits the versioned `sky.subscription.intent.v1` integration contract.

## Integration contract

`toSubscriptionIntent` produces a provider-neutral command for downstream billing/payment adapters. This module does not contact Stripe, banks, wallets, blockchains, or any external billing provider and does not claim settlement, recurring charge execution, tax calculation, invoicing, entitlement delivery, or production deployment.

## Security and product boundaries

Callers remain responsible for authentication, authorization, tenant isolation, durable persistence, idempotency, webhook verification, payment-provider reconciliation, tax/compliance controls, and production observability. Amounts use safe integer minor units to avoid floating-point billing arithmetic.
