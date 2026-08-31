# Sky4 Validator / Mining

Engineering-beta validator-selection simulation core tracked by Issue #146.

## Capability

- validates bounded validator IDs, positive stake, uptime and penalty ranges;
- derives bigint effective weights from stake, uptime and penalties;
- rejects duplicate validators and zero-effective-weight candidates;
- deterministically selects one validator from a caller-provided seed using SHA-256-derived weighted selection.

## Integration contract

Import `effectiveWeight` and `selectValidator` from `src/index.ts`. The caller supplies candidate state and an explicit seed.

## Product boundary

This package does **not** mine blocks, create proof-of-work, implement a live proof-of-stake network, custody stake, slash validators, generate rewards, prevent manipulation of real randomness/beacons, persist validator state, or provide consensus/security guarantees. It is a deterministic selection simulation library only.
