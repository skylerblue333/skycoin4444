# Crypto Products Beta Contract

## Scope

This tranche connects the previously disconnected wallet, swap, liquidity-pool, exchange/trading, and store routes to one shared crypto product workspace.

## Working behavior

### Non-custodial browser wallet

The wallet screen uses the EIP-1193 browser-provider contract exposed by compatible wallets.

It can:

- request the user's account with `eth_requestAccounts`;
- read the active chain with `eth_chainId`;
- read the wallet balance with `eth_getBalance`;
- request a user-approved message signature with `personal_sign`;
- submit a user-approved transaction with `eth_sendTransaction` only on the beta allowlist.

The beta broadcast allowlist is:

- Ethereum Sepolia — `0xaa36a7`;
- Base Sepolia — `0x14a34`.

SKYCOIN4444 never receives the wallet's private key or seed phrase.

### Swap

The server computes deterministic constant-product `x*y=k` swap quotes from caller-supplied reserves, amount, and fee. The quote includes deterministic ID, output amount, and price-impact basis points.

This is real AMM math but not a live-liquidity claim.

### Liquidity pools

The server calculates proportional liquidity-deposit plans, including minted shares, used asset quantities, and unused remainders.

This is a deterministic planner. It does not submit an LP deposit to a live DEX.

### Trading

The server validates limit-order inputs and calculates maximum quote-unit exposure. It deliberately does not fabricate market prices, fills, P&L, or exchange execution.

### Store

The server creates deterministic checkout/payment-request plans from SKU, quantity, unit price, and settlement asset. It does not claim inventory reservation, shipping, payment completion, or merchant settlement.

## Routes consolidated

The shared workspace now backs:

- Wallet Connect
- Send Crypto
- Receive Crypto
- Blockchain Custody entry point
- Swap Interface
- Cross-Chain Swap
- Liquidity Pools
- Crypto Exchange
- Trading
- Trading Terminal
- Sky Store

## Explicitly not enabled

The following remain gated:

- server-side custody;
- private-key or seed-phrase collection;
- mainnet transaction broadcast;
- live DEX execution;
- live LP deposits;
- live centralized-exchange order execution;
- leverage or derivatives;
- merchant settlement;
- mining-pool/Stratum share submission and payouts.

Those require real provider/node/pool relationships, secrets outside the client bundle, transaction reconciliation, failure recovery, incident controls, and environment-specific verification before activation.
