# SkyFundraising (#82)

SkyFundraising is an engineering-beta fundraising domain core. It models campaign state and validates contribution intents using integer minor currency units.

## Capability
- campaign invariant validation
- active-state contribution gating
- currency and idempotency-key validation
- projected raised-total calculation with safe-integer checks
- deterministic completion percentage

## Integration contract
Callers persist campaigns and contribution/idempotency records externally. `evaluateContribution` is a pure decision function and does not move money.

## Important limitations
No payment processor, bank rail, cryptocurrency transfer, charity verification, regulatory approval, tax treatment, durable persistence, refund execution, or production deployment is provided or claimed.
