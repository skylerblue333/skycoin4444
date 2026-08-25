# SkyInvoices — Slot #83 / Lane 05

SkyInvoices is an **engineering-beta invoice domain library** for SKYCOIN4444. It provides deterministic invoice math and lifecycle rules; it is not a payment processor, accounting system, tax engine, or legal invoicing service.

## Core behavior

- draft invoice creation with integer minor-unit arithmetic
- strict currency, identifier, line-description, quantity, and amount validation
- safe-integer overflow checks
- lifecycle transitions: draft → issued → paid, or draft/issued → void
- defensive-copy reads
- `InvoiceLedgerContract` events for integration with a future SkyLedger/SkyAccounting adapter

## Security and product boundary

No card data, bank credentials, tax identifiers, payment tokens, or secrets are processed. Marking an invoice paid records only a caller-authorized domain transition; it does not prove settlement with an external provider. Taxes, jurisdictional requirements, accounting compliance, invoice numbering regulations, persistence, authorization, and immutable ledger storage belong to production adapters.

## Validation

```bash
pnpm run check:packages
pnpm exec vitest run --config packages/sky-invoices/vitest.config.ts
pnpm exec prettier --check packages/sky-invoices
```

The library adds no runtime dependencies. Repository CI remains authoritative for merge readiness.
