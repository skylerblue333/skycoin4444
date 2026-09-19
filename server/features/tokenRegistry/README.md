# SkyTokenRegistry (#147)

SkyTokenRegistry is a bounded engineering-beta metadata registry for SKYCOIN4444 token definitions. It normalizes token identity and symbols, enforces duplicate-ID and per-network symbol uniqueness, validates decimal metadata, and emits the versioned `sky.token-registry.snapshot.v1` integration contract.

## Boundaries

This module is metadata/domain logic only. It does not create, mint, transfer, price, custody, sign, submit, or monitor blockchain assets or transactions. It performs no wallet authentication, chain RPC/provider calls, contract verification, market-data retrieval, compliance certification, durable persistence, or verified production deployment.

## Official TRUMP integration

`officialTrump.ts` exposes the explicitly identified Official TRUMP SPL asset on Solana mainnet-beta and `createOfficialTrumpRegistry()` returns a fresh registry containing that metadata. `createOfficialTrumpTransferIntent()` performs deterministic validation and creates an **unsigned** transfer intent. It never receives private keys, signs, broadcasts, or automates a transaction; a user-controlled wallet must independently review and sign any future transaction.

The configured mint is `6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN`. Treat this as an integration identifier, not an investment recommendation or price claim.
