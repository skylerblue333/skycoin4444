# Sky4 Wallet Engine

Engineering-beta deterministic wallet planning/accounting core tracked by Issue #146.

## Capability

- validates runtime account objects, bounded account IDs, public-key encoding, bigint balances and nonces;
- plans transfers deterministically with explicit fee and nonce handling;
- validates transfer-plan shape and SHA-256 integrity before local debit accounting;
- rejects self-transfers, overdrafts, stale nonces, malformed numeric types and tampered/negative transfer plans;
- applies local debit accounting without mutating the caller's wallet object.

## Integration contract

Import `validateWalletAccount`, `validateTransferPlan`, `planTransfer`, and `applyPlannedDebit` from `src/index.ts`. Amounts and fees use `bigint` smallest units. Callers must provide signing, broadcast, persistence and denomination policies.

## Security and product boundary

This package does **not** generate or custody private keys, sign transactions, connect to a blockchain, broadcast transfers, provide recovery phrases, persist balances, execute payments, guarantee settlement, or provide compliance/security certification. It is a deterministic wallet-domain planner for later integration.
