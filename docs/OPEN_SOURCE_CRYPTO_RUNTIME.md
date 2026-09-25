# Open-Source Crypto Runtime

SKYCOIN4444's crypto engineering beta uses a standards-compatible integration boundary rather than pretending that local demo code is a live blockchain.

## Open-source runtimes

- **Bitcoin Core** — MIT licensed. The server-side adapter speaks Bitcoin Core JSON-RPC and uses `getblockchaininfo` for a read-only health/height probe.
- **Agave / Solana** — Apache-2.0 licensed. The adapter uses the standard Solana JSON-RPC methods `getHealth`, `getSlot`, and `getVersion`.
- **Ethereum / EVM** — the adapter uses standard Ethereum JSON-RPC methods `eth_chainId` and `eth_blockNumber`. It is compatible with common open-source clients and TypeScript interfaces such as viem (MIT).

No third-party source code is copied into this repository by this tranche. SKYCOIN4444 interoperates with the public RPC contracts exposed by those open-source runtimes.

## Operator configuration

Read-only probes are enabled only when server-owned environment variables are configured:

- `BITCOIN_RPC_URL`
- `BITCOIN_RPC_USER` and `BITCOIN_RPC_PASSWORD` when the Bitcoin node requires basic authentication
- `ETHEREUM_RPC_URL`
- `SOLANA_RPC_URL`

The browser never supplies RPC URLs or credentials.

## Mining boundary

`POST /api/crypto-lab/mining/benchmark` performs real bounded SHA-256 hashing in the server process. It reports the number of hashes, measured elapsed time, hash rate, shares that meet the selected local prefix target, and the best hash found.

It does **not**:

- submit work to a pool;
- claim BTC, SOL, ETH, TRUMP, SKY444, or any other coin reward;
- fabricate USD value;
- run an unbounded CPU loop;
- claim proof-of-work consensus participation.

Real pool mining remains an external-infrastructure integration project.

## Wallet and block boundary

The transfer planner reuses `packages/sky4-wallet-engine` for balance, fee, nonce, and plan-integrity validation.

The block builder reuses `packages/sky4-core-ledger` to create deterministic SHA-256 block hashes from validated local transfers.

These operations are real domain logic but remain **unsigned and unbroadcast**. No private keys are generated or stored, and no external chain state is mutated.

## Production activation

Live transaction signing, custody, pool submission, settlement, or broadcast must remain disabled until the repository has:

1. an approved node/provider configuration;
2. secrets stored outside the client bundle;
3. explicit user authorization;
4. idempotency and replay protection;
5. transaction monitoring and reconciliation;
6. incident/kill-switch controls;
7. exact-head CI and environment-specific evidence.
