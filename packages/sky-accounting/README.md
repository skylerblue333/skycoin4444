# SkyAccounting (#86)

SkyAccounting is an engineering-beta accounting domain core for SKYCOIN4444. It validates balanced journal entries and computes deterministic per-account debit-minus-credit totals.

## Integration
Use `validateJournalEntry()` before accepting entries and `accountTotals()` for bounded in-memory summaries.

## Limitations
This is not a regulated accounting system, tax engine, general ledger of record, bank integration, payment processor, durable datastore, reconciliation service, or compliance product. Currency precision is limited to two decimal places and callers remain responsible for persistence, authorization, period controls, audit retention, reporting standards, and external accounting review.
