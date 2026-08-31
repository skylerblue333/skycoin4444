# Sky4 Cross-Chain Bridge

Engineering-beta cross-chain transfer planning/validation core tracked by Issue #146.

## Capability

- validates bounded source/destination chain identifiers, asset IDs, amount ranges and fees;
- rejects same-chain routes and out-of-range transfers;
- computes deterministic integer fees/net amounts with bigint arithmetic;
- derives stable SHA-256 plan IDs for downstream integration/audit use.

## Integration contract

Import `validateRoute` and `planBridgeTransfer` from `src/index.ts`. Callers supply approved routes and sender/recipient identifiers; the library only produces deterministic plans.

## Security and product boundary

This package does **not** lock/mint/burn assets, custody funds or keys, deploy bridge contracts, connect to external chains, verify light-client proofs, operate relayers, guarantee finality, prevent bridge exploits, or execute live transfers. It is a bridge planning/validation domain core only.
