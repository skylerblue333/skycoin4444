# SkyCatalog — Slot #137 / Lane 05

SkyCatalog is an **engineering-beta product/service catalog domain core** for SKYCOIN4444. It models catalog metadata, draft/publish/archive lifecycle, validated integer-minor-unit prices, and local availability metadata.

## Integration

SkyCatalog consumes the merged SkyInventory contract `skyinventory.availability.v1`. The integration test calls SkyInventory's real `toCatalogAvailability` helper and feeds the result into `applyAvailability`.

## Truth and security boundary

This package is not a storefront, inventory authority, payment processor, tax engine, fulfillment system, merchant onboarding system, or production pricing service. Availability is caller-supplied inventory metadata and does not guarantee physical stock. Production adapters must provide persistence, authorization, concurrency controls, localization, tax/price policy, seller governance, and external fulfillment evidence.

## Validation

```bash
pnpm run check:packages
pnpm exec vitest run --config packages/sky-catalog/vitest.config.ts
pnpm exec prettier --check packages/sky-catalog
```

No runtime dependency is added. Repository CI is authoritative for merge readiness.
