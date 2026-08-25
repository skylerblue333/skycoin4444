# SkyPricing — Slot #138 / Lane 06

SkyPricing is an engineering-beta commerce pricing library. It calculates deterministic quotes from caller-supplied base prices, quantities, and discount rules using integer minor units and basis points.

## Boundaries

- No checkout, payment provider, tax engine, exchange-rate provider, or marketplace seller system is connected.
- Quotes are calculations, not offers, invoices, charges, or accounting entries.
- Tax, shipping, jurisdiction rules, catalog authorization, and price persistence remain outside this library.

## SKYCOIN4444 integration contract

Catalog/order adapters can normalize a SKU price to `PriceInput`, supply authorized `PricingRule` values, and call `quotePrice`. The returned `PriceQuote` exposes subtotal, discount, total, currency, quantity, and applied rule IDs for downstream display or order validation.

## Security and integrity

SKUs/rule IDs and currencies are allow-list validated. Monetary values and quantities must be safe integers; discounts use basis points and are capped at 100%. Callers must authorize which rules may apply and revalidate quotes server-side before committing orders.

## Validation

```sh
pnpm exec vitest run packages/sky-pricing/src/index.test.ts
pnpm run check:packages
pnpm exec prettier --check packages/sky-pricing
pnpm audit --audit-level high
```
