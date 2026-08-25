# SkyCoupons — Wave 2 #139 (Lane 07)

SkyCoupons is an **engineering-beta discount policy library** for SKYCOIN4444 commerce flows. It validates coupon definitions, evaluates active windows/redemption limits/currency compatibility, and returns deterministic discount quotes capped at the caller-supplied subtotal.

## Integration
`coupon.applied` events can be consumed by SkyCheckout, SkyOrders, SkyPricing, SkyLedger, or analytics after the application durably records a valid redemption.

## Boundaries
This package does not reserve coupons, persist redemption counts, authorize shoppers, charge/refund money, prevent distributed races, or provide tax/accounting advice. Production use requires transactional persistence, tenant scoping, rate limits, abuse controls, and authoritative checkout totals.
