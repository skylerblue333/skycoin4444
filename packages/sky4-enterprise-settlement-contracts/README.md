# Sky4 Enterprise Settlement Contracts

Engineering-beta settlement instruction planning/reconciliation core tracked by Issue #146.

## Capability

- validates bounded settlement references, payer/payee accounts, assets, positive amounts and due times;
- rejects self-settlement instructions;
- derives deterministic SHA-256 plan IDs and planned/expired status;
- reconciles supplied evidence only when reference, asset and amount exactly match a planned instruction.

## Integration contract

Import `planSettlement` and `reconcileSettlement` from `src/index.ts`. The caller owns authorization, provider connectivity, persistence and execution.

## Product boundary

This package does **not** move money or tokens, connect to banks/payment processors/blockchains, custody assets, verify provider receipts, guarantee settlement/finality, perform accounting certification, or provide compliance/regulatory approval. It is a deterministic settlement planning/reconciliation library only.
