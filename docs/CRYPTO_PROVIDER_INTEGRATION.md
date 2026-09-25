# Real Crypto Provider Integration

## Scope

This tranche adds provider adapters that can perform real external operations when operators supply credentials and explicitly enable the relevant capability.

It does not make any provider, custody, payout, profitability, compliance, or settlement claim merely because adapter code exists.

## Provider adapters

### Stratum V1 mining pool

Server environment:

- `STRATUM_HOST`
- `STRATUM_PORT`
- `STRATUM_USERNAME`
- `STRATUM_PASSWORD`
- `STRATUM_TLS=true|false`
- `STRATUM_SHARE_SUBMISSION_ENABLED=true|false`

The adapter opens a real TCP/TLS session and performs:

1. `mining.subscribe`;
2. `mining.authorize`;
3. optional `mining.submit` when the operator explicitly enables share submission.

Share submission requires an authenticated administrator. Pool credentials never reach the browser.

This is connectivity/share-submission plumbing, not a claim that the server has valid pool work, profitable hardware, an accepted share, or payout eligibility.

### Mining payout provider

Server environment:

- `MINING_PAYOUT_API_URL`
- optional `MINING_PAYOUT_API_TOKEN`
- optional `MINING_PAYOUT_PROVIDER`

The configured endpoint must return either an array or `{ "payouts": [...] }` where every record has:

- `id`
- `asset`
- `amountAtomic`
- `status`
- optional `txHash`
- optional `createdAt`

The administrator can fetch the records and reconcile settled versus expected atomic units.

When MySQL is configured, observed provider events are written to `crypto_provider_events`.

### 0x Swap API v2

Server environment:

- `ZEROX_API_KEY`
- optional `ZEROX_API_URL` (defaults to `https://api.0x.org`)

The adapter calls the v2 AllowanceHolder quote endpoint and sends the required `0x-api-key` and `0x-version: v2` headers.

The browser receives the quote and transaction request, but the server does not broadcast it. Token allowances and final wallet approval remain the user's responsibility.

### Mainnet wallet policy

Mainnet sending stays fail-closed unless all required policy conditions pass.

Server environment:

- `CRYPTO_MAINNET_ENABLED=true`
- `CRYPTO_MAINNET_ALLOWED_CHAIN_IDS=1,8453,...`
- `CRYPTO_MAINNET_DESTINATION_ALLOWLIST=0x...,0x...`
- `CRYPTO_MAINNET_MAX_NATIVE_WEI=<integer>`

A transaction is allowed only when:

- mainnet is enabled;
- the chain is allowlisted;
- the destination is allowlisted;
- a positive maximum native value is configured;
- the requested native value does not exceed the maximum.

Passing this policy does not remove the browser wallet's explicit user approval.

### Transaction reconciliation

The adapter can query configured nodes for transaction confirmation state:

- EVM: `eth_getTransactionReceipt` + `eth_blockNumber`
- Solana: `getSignatureStatuses`
- Bitcoin Core: `getrawtransaction` with verbose output

Configuration:

- `EVM_RPC_URLS_JSON` mapping chain ID to RPC URL;
- fallback `ETHEREUM_RPC_URL` for chain 1;
- `SOLANA_RPC_URL`;
- `BITCOIN_RPC_URL` and optional Bitcoin RPC basic-auth variables;
- optional `CRYPTO_CONFIRMATIONS_REQUIRED`.

Reconciliation records are written to the provider event ledger when MySQL is configured.

### OpenBao Transit external signing

Server environment:

- `OPENBAO_URL`
- `OPENBAO_TOKEN`
- `OPENBAO_TRANSIT_KEY`
- optional `OPENBAO_TRANSIT_MOUNT` (defaults to `transit`)
- optional `OPENBAO_NAMESPACE`
- `OPENBAO_SIGNING_ENABLED=true`

The adapter sends a base64-encoded prehashed 32-byte digest to the Transit sign endpoint and returns the provider signature. The signing key remains outside the application process.

OpenBao integration is an external signing/key-isolation boundary. It is not by itself a claim of certified HSM custody or regulated asset custody.

### MPC signer gateway

Server environment:

- `MPC_SIGNER_URL`
- `MPC_SIGNER_TOKEN`
- `MPC_KEY_ID`
- `MPC_SIGNING_ENABLED=true`

The gateway contract is:

```json
{
  "requestId": "uuid",
  "keyId": "provider-key-reference",
  "digestHex": "64-hex-character digest",
  "algorithm": "secp256k1-sha256"
}
```

The provider must return a `signature`, with optional `requestId`.

The adapter sends an idempotency key and bearer credential from the server. It never accepts a private key from the browser.

## Durable provider event ledger

Migration `0014_crypto_provider_events.sql` adds a provider-event table containing:

- provider;
- event type;
- asset and atomic amount;
- external reference;
- transaction hash;
- status;
- bounded metadata;
- user linkage;
- timestamps.

Atomic values are stored as decimal strings rather than floating-point numbers.

## Authorization

Read-only provider status is visible to authenticated beta users.

These operations require an administrator account:

- Stratum subscribe/authorize probe;
- Stratum share submission;
- mining payout ingestion/reconciliation;
- OpenBao signing;
- MPC gateway signing.

## Still not automatically enabled

This code does not automatically enable:

- profitable mining;
- pool work acquisition or continuous miner scheduling;
- custody of customer assets;
- mainnet transactions to arbitrary destinations;
- automatic token approvals;
- automatic DEX execution;
- withdrawal approval workflows;
- sanctions/KYC/AML screening;
- regulated custody claims;
- guaranteed transaction finality;
- guaranteed mining payouts.

Every live provider must still be configured, funded where applicable, monitored, reconciled, and separately approved for the target environment.
