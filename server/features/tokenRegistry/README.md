# SkyTokenRegistry (#147)

SkyTokenRegistry is a bounded engineering-beta metadata registry for SKYCOIN4444 token definitions. It normalizes token identity and symbols, enforces duplicate-ID and per-network symbol uniqueness, validates decimal metadata, and emits the versioned `sky.token-registry.snapshot.v1` integration contract.

## Boundaries

This module is metadata/domain logic only. It does not create, mint, transfer, price, custody, sign, submit, or monitor blockchain assets or transactions. It performs no wallet authentication, chain RPC/provider calls, contract verification, market-data retrieval, compliance certification, durable persistence, or verified production deployment.

## Official TRUMP integration

`officialTrump.ts` exposes a bounded Solana token-integration contract for the Official TRUMP asset identifier and `createOfficialTrumpRegistry()` returns a fresh registry containing that metadata. `createOfficialTrumpTransferIntent()` performs deterministic validation and creates an **unsigned** transfer intent.

The integration never receives private keys, signs, broadcasts, automates a transaction, or claims any affiliation between SKYCOIN4444 and Donald Trump, the Trump Organization, CIC Digital, Fight Fight Fight LLC, or any token issuer. A user-controlled wallet must independently review and sign any future transaction.

Configured Solana mint: `6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN`.

Treat the configured address as an integration identifier only. This module does not provide investment advice, a price forecast, political advocacy, or a recommendation to buy, sell, hold, or transfer any asset.
