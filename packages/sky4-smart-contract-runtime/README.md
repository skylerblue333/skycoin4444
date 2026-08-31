# Sky4 Smart Contract Runtime

Engineering-beta deterministic contract execution/validation core tracked by Issue #146.

## Capability

- validates bounded contract IDs, versions, operation keys and values;
- executes a small deterministic instruction set (`set`, `increment`, `assert-eq`);
- meters execution with explicit bigint gas limits and fails closed when limits are exceeded;
- emits deterministic SHA-256 receipt hashes for test/integration evidence.

## Integration contract

Import `executeContract` from `src/index.ts`. Callers provide the program, initial state and gas limit. The returned state is in-memory and intentionally transport/storage agnostic.

## Security and product boundary

This package is **not** a deployed smart-contract VM, EVM/WASM implementation, blockchain execution layer, sandboxed untrusted-code runtime, fee market, on-chain state database, validator environment, or audited production contract platform. It executes only the bounded domain operations defined by this package.
