# Sky4 P2P Network

Engineering-beta peer registry and deterministic dial-selection core tracked by Issue #146.

## Capability

- validates bounded peer IDs, DNS-style hosts, and TCP/UDP port ranges;
- tracks peer scores and last-seen timestamps without mutating the caller's map;
- clamps reputation scores to a bounded range;
- deterministically selects non-stale, non-negative-score dial candidates by score then peer ID.

## Integration contract

Import `validatePeerAddress`, `upsertPeer`, and `selectDialCandidates` from `src/index.ts`. Callers provide clock values explicitly so tests and higher-level networking code remain deterministic.

## Security and product boundary

This package does **not** open sockets, discover Internet peers, provide encryption/authentication, perform NAT traversal, implement gossip, guarantee Sybil resistance, persist peer state, or establish a live cryptocurrency network. It is a deterministic peer-management domain core for later transport integration.
