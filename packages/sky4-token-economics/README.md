# Sky4 Token Economics

Engineering-beta tokenomics modeling core tracked by Issue #146.

## Capability

- validates bounded named allocation buckets against an exact expected supply;
- rejects duplicate buckets, negative allocations and silent supply mismatches;
- projects deterministic integer annual supply growth using basis points;
- calculates allocation percentages in basis points without floating-point accounting.

## Integration contract

Import `validateAllocations`, `projectSupply`, and `allocationPercentBps` from `src/index.ts`. Amounts use `bigint` smallest units. The caller owns denomination, policy approval and any external issuance mechanism.

## Product boundary

This package does **not** issue a cryptocurrency, mint tokens, create investment rights, set a market price, promise returns, execute fundraising, provide legal/tax advice, determine regulatory status, or connect to a live blockchain. It is a deterministic economic-modeling library only.
