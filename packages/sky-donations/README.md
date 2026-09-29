# SkyDonations — Wave 2 Slot #81

SkyDonations is an **engineering-beta donation records/workflow domain core**. It models pledged, recorded, and cancelled donation records using integer minor currency units, emits a deterministic `skyhope.donation.recorded` integration event, and now includes bounded idempotent in-memory ledger orchestration for SkyHope/Impact mission flows.

## Supported behavior

- validates donation IDs, donor/campaign references, money amounts, currency codes, and timestamps;
- models explicit pledge → recorded and pledge → cancelled lifecycle transitions;
- produces stable integration events for locally recorded donations;
- provides idempotent pledge handling so retries do not silently duplicate local records;
- rejects reuse of an idempotency key with changed donation input;
- isolates campaign listing;
- returns non-financial acknowledgements that explicitly state payment execution, settlement verification, and tax-receipt issuance did not occur;
- exposes snapshots that state persistence and external payment execution were not performed.

## Boundaries

This package does not process cards, move funds, issue tax receipts, perform KYC/AML, connect to charities, verify beneficiaries, or verify settlement. `markRecorded` means an authorized upstream system has told this local domain core that a donation was recorded; it is not proof of external payment settlement.

`DonationLedger` is process-memory orchestration for deterministic tests and integration work. It is not durable persistence and is not a payment ledger.

## Integration

`toIntegrationEvent` returns a stable event contract suitable for SkyHope campaign totals, SkyLedger posting orchestration, notification consumers, or Impact Mission evidence capture. Those consumers remain responsible for authorization, durable idempotency, storage, provider execution, refunds, settlement evidence, beneficiary verification, legal/compliance controls, and tax-receipt rules.

## Validation

Run from the repository root:

```sh
pnpm run check:packages
pnpm vitest run packages/sky-donations/src/index.test.ts
```
