# Sky4 Staking Engine

Engineering-beta staking accounting/planning core tracked by Issue #146.

## Capability

- validates owner IDs, positive principal, bounded reward rates and epoch values;
- computes deterministic bigint rewards by elapsed epoch;
- advances a local reward-claim cursor without changing principal;
- evaluates unstaking eligibility against an explicit lock epoch.

## Integration contract

Import `validateStake`, `accruedReward`, `claimReward`, and `canUnstake` from `src/index.ts`. Callers provide current epoch and own persistence/authorization policies.

## Product boundary

This package does **not** stake assets on a blockchain, custody funds or keys, create validator delegations, distribute live rewards, guarantee yields/APY, slash participants, persist positions, execute withdrawals, or provide financial/regulatory advice. It is deterministic staking accounting/planning only.
