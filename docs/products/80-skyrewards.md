# SkyRewards — Slot #80 / Lane 02

SkyRewards is an **engineering-beta rewards domain core** for deterministic points accounting.

It validates reward entry identifiers, bounded safe-integer point deltas, reason/direction rules, duplicate entry IDs, and non-negative account balances.

## Integration contract

SKYCOIN4444 callers may supply persisted reward entries and use `calculateRewardBalance` to derive an account balance. Finance products such as SkyLedger or SkyReconciliation may later consume emitted reward-domain records through an explicit adapter.

## Security and truth boundaries

SkyRewards does not transfer money, custody assets, connect to a payment or loyalty provider, issue blockchain tokens, or persist records by itself. Authorization, persistence, idempotency across distributed systems, fraud controls, and external-provider verification remain caller responsibilities.

Deterministic tests cover normal earn/redeem behavior, negative-balance prevention, duplicate-entry rejection, and invalid point direction.
