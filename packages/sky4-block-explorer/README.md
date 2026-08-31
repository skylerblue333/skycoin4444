# Sky4 Block Explorer

Engineering-beta deterministic chain/query indexing core tracked by Issue #146.

## Capability

- validates transfer identifiers, account identifiers, block heights and positive amounts;
- builds an immutable-style in-memory index by transfer ID and account;
- supports deterministic account-history ordering and bounded pagination;
- rejects duplicate transfer IDs and malformed query inputs.

## Integration contract

Import `buildExplorerIndex`, `getTransfer`, and `listAccountTransfers` from `src/index.ts`. Callers provide already-validated chain data; this package only indexes/query-plans it.

## Security and product boundary

This package does **not** connect to a live blockchain node, crawl a network, verify consensus, persist an index, provide RPC/WebSocket services, expose a production website, or guarantee chain finality. It is a deterministic indexing/query domain core for later explorer integration.
