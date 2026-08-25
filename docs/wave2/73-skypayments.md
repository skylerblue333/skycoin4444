# SkyPayments — Wave 2 #73

SkyPayments is a bounded payment-intent and authorization-planning domain core. It validates
positive integer minor-unit amounts, currency codes, safe identifiers, unique intent IDs and
idempotency keys. It also enforces a deterministic intent lifecycle and emits the versioned
`sky.payments.authorization-plan.v1` integration contract for a separately authenticated
payment adapter.

## Integration boundary

The caller supplies an authenticated account context and opaque payment-method reference.
SkyPayments returns a plan; an external adapter owns provider authentication, network execution,
webhook verification, settlement evidence and durable persistence. Provider evidence is required
before an intent can be represented as authorized or captured.

## Security and product limits

This engineering-beta library does **not** process, custody, transmit or settle funds. It has no
live banking/card/crypto provider, PCI environment, KYC/AML controls, fraud decisioning, refunds,
chargebacks, durable store, exactly-once delivery, compliance certification or verified
production deployment. Raw payment credentials must never be passed as references.
