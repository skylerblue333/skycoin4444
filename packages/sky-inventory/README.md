# SkyInventory — Wave 2 Slot #135

SkyInventory is an **engineering-beta inventory domain core** for SKU stock, reservations, releases, receiving, and shipping transitions. It prevents local overselling by separating on-hand from reserved quantity and emits a stable catalog availability contract.

## Truth boundary
This package does not connect to warehouses, carriers, ERP systems, payment processors, or physical scanners. A `ship` transition is a local inventory state change, not proof that a parcel was physically shipped or delivered.

## Security and validation
SKUs are constrained to safe identifier characters, quantities are positive safe integers, stock cannot be reserved beyond availability, releases cannot exceed reservations, and shipping requires an existing reservation. No secrets or network calls are used.

## Integration
`toCatalogAvailability` emits `skyinventory.availability.v1`, suitable for SkyCatalog/SkyOrders availability checks. Consumers remain responsible for persistence, concurrency control, authorization, idempotency, and external fulfillment evidence.

## Validation
```sh
pnpm run check:packages
pnpm vitest run packages/sky-inventory/src/index.test.ts
```
