# Sky4 Oracle Data

Engineering-beta oracle observation validation/aggregation core tracked by Issue #146.

## Capability

- validates bounded feed/source identifiers and observation timestamps;
- filters stale observations using an explicit caller-supplied clock/max-age policy;
- keeps only the newest observation per source;
- requires a configurable minimum number of fresh unique sources and computes a deterministic bigint median.

## Integration contract

Import `aggregateMedian` from `src/index.ts`. Callers supply observations, current time, freshness policy and minimum-source policy.

## Security and product boundary

This package does **not** connect to live oracle providers, authenticate data sources, fetch prices, guarantee data correctness, resist colluding sources, persist feeds, publish on-chain values, execute trades, or provide financial/security guarantees. It is a deterministic aggregation/validation core only.
