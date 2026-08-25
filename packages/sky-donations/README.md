# SkyDonations — Wave 2 Slot #81

SkyDonations is an **engineering-beta donation records/workflow domain core**. It models pledged, recorded, and cancelled donation records using integer minor currency units and emits a deterministic `skyhope.donation.recorded` integration event for downstream SKYCOIN4444/SkyHope consumers.

## Boundaries
This package does not process cards, move funds, issue tax receipts, perform KYC/AML, connect to charities, or verify settlement. `markRecorded` means an authorized upstream system has told this local domain core that a donation was recorded; it is not proof of external payment settlement.

## Security and validation
Identifiers are bounded non-empty strings, amounts must be positive safe integers, currencies use three-letter uppercase codes, timestamps are validated, and invalid lifecycle transitions are rejected. No secrets or external network calls are used.

## Integration
`toIntegrationEvent` returns a stable event contract suitable for SkyHope campaign totals, SkyLedger posting orchestration, or notification consumers. Those consumers remain responsible for their own authorization, idempotency, storage, and settlement evidence.

## Validation
Run from the repository root:

```sh
pnpm run check:packages
pnpm vitest run packages/sky-donations/src/index.test.ts
```
