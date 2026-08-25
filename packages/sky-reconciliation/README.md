# SkyReconciliation — Slot #84 / Lane 06

SkyReconciliation is an engineering-beta deterministic transaction reconciliation library. It compares caller-supplied internal and external records using a shared external reference, integer minor units, and currency.

## Boundaries

- No payment provider, bank feed, exchange, or blockchain node is connected.
- No money is moved and no accounting entry is posted.
- Results are comparison findings, not accounting or compliance attestations.
- The caller owns persistence, source authenticity, authorization, and remediation.

## SKYCOIN4444 integration contract

Ledger/payment adapters can normalize their records to `ReconciliationRecord` and call `reconcile(internal, external)`. Results distinguish matched, missing, mismatched, and duplicate external references without silently correcting data.

## Security and data integrity

Identifiers are allow-list validated, currencies must be three uppercase letters, and amounts must be JavaScript safe integers representing minor units. Floating-point monetary inputs are rejected.

## Validation

```sh
pnpm exec vitest run packages/sky-reconciliation/src/index.test.ts
pnpm run check:packages
pnpm exec prettier --check packages/sky-reconciliation
pnpm audit --audit-level high
```
