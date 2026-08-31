# Sky4 Core Ledger

Engineering-beta deterministic ledger domain core for the post-Wave-2 Sky4 incubation program (Issue #146).

## Capability

- validates bounded account identifiers, positive integer transfer amounts and non-negative nonces;
- derives deterministic SHA-256 transfer and block identifiers from canonical inputs;
- rejects duplicate transfers inside a block;
- applies transfers against an in-memory balance snapshot while preventing overdrafts.

## Integration contract

Import `createBlock`, `applyBlock`, `transferId`, and `validateTransfer` from `src/index.ts`. Amounts use `bigint` smallest units; callers must define denomination and persistence/network policy outside this library.

## Security and product boundary

This package does **not** implement or claim a deployed blockchain, peer-to-peer consensus, signatures/key custody, mining, staking rewards, settlement, durable persistence, external network connectivity, regulatory approval, compliance certification, or production security guarantees. It is a deterministic domain core and test harness intended to support later protocol work.
