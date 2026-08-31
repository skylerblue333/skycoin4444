# Sky4 Governance DAO

Engineering-beta governance proposal/tally domain core tracked by Issue #146.

## Capability

- validates proposal identifiers, titles, time windows and quorum thresholds;
- rejects duplicate voters, proposal mismatches and impossible participation totals;
- tallies bigint voting power deterministically;
- marks proposals passed only after close when quorum is reached and yes power exceeds no power.

## Integration contract

Import `tallyProposal` from `src/index.ts`. The caller supplies proposal metadata, eligible voting power, ballots and the explicit current time.

## Product boundary

This package does **not** deploy a DAO, authenticate voters, custody governance tokens, execute proposals, enforce legal rights, perform on-chain voting, persist ballots, prevent Sybil attacks, or provide regulatory/compliance guarantees. It is a deterministic governance-domain library only.
