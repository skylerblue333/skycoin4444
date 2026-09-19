# SkyCheckout (#76)

SkyCheckout is a bounded checkout-domain core for SKYCOIN4444 Wave 2. It validates runtime cart/request shapes and produces deterministic checkout quotes using integer minor currency units.

## Integration contract

`sky.checkout.quote.v1` returns checkout ID, normalized currency, subtotal, shipping, tax, discount, and total amounts. The output is provider-neutral and intended for downstream payment/order orchestration. Public quote construction fails closed on malformed request/line objects and non-string text fields instead of relying on TypeScript types at runtime.

## Boundaries

This package does **not** process payments, reserve inventory, calculate authoritative tax, call shipping carriers, persist carts, authenticate users, perform fraud decisions, or claim production deployment/compliance. Callers must supply already-authorized inputs and integrate real providers separately.

## Verification

Focused tests cover totals, normalization, invalid quantities/money, excessive discounts, malformed identifiers, malformed runtime request/line shapes, and currency validation. CI runs the focused Vitest suite and package TypeScript gate.
