# Sky4 Consensus Engine

Engineering-beta deterministic consensus validation/simulation core tracked by Issue #146.

## Capability

- validates bounded validator identifiers and positive voting power;
- rejects duplicate validators, duplicate votes, unknown validators and vote-height mismatches;
- evaluates a deterministic two-thirds voting-power quorum for one candidate block;
- derives a stable SHA-256 result digest for integration/audit use.

## Integration contract

Import `evaluateQuorum`, `validateValidator`, and `validateVote` from `src/index.ts`. Voting power uses `bigint`. The caller supplies the validator set, candidate block hash and votes.

## Security and product boundary

This library does **not** implement a deployed blockchain consensus network, peer discovery, validator key custody, signatures, Byzantine fault tolerance across live nodes, slashing, staking rewards, durable persistence, external networking, or production security guarantees. It is a deterministic domain core and test harness for later protocol integration.
