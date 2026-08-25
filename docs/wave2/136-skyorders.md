# SkyOrders (#136)

SkyOrders is an engineering-beta order domain core.

## Capability
- order/line validation using integer minor currency units
- deterministic total calculation with safe-integer protection
- inventory availability checks and shortage reporting
- bounded order lifecycle transitions

## Integration contract
`evaluatePlacement` accepts inventory availability snapshots compatible with adjacent SkyInventory/SkyCatalog-style consumers. Callers remain responsible for durable persistence, concurrency control, reservation execution, payment authorization, idempotency, and fulfillment evidence.

## Important limitations
No payment capture, warehouse operation, carrier integration, shipment execution, tax engine, ERP connection, durable order store, or production deployment is provided or claimed.
