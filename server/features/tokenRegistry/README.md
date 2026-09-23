# SkyTokenRegistry (#147)

SkyTokenRegistry is a bounded engineering-beta metadata registry for SKYCOIN4444 token definitions. It normalizes token identity and symbols, enforces duplicate-ID and per-network symbol uniqueness, validates decimal metadata, and emits the versioned `sky.token-registry.snapshot.v1` integration contract.

## Boundaries

This module is metadata/domain logic only. It does not create, mint, transfer, price, custody, sign, submit, or monitor blockchain assets or transactions. It performs no wallet authentication, chain RPC/provider calls, contract verification, market-data retrieval, compliance certification, durable persistence, or verified production deployment.

## Official TRUMP integration

`officialTrump.ts` exposes a bounded Solana token-integration contract for the Official TRUMP asset identifier and `createOfficialTrumpRegistry()` returns a fresh registry containing that metadata. `createOfficialTrumpTransferIntent()` performs deterministic validation and creates an **unsigned** transfer intent.

SKYCOIN4444 designates this configured TRUMP asset as its **officially supported primary external crypto asset for the engineering beta** through `SKYCOIN4444_OFFICIAL_CRYPTO_ASSET`. That designation is internal to SKYCOIN4444 only. It does **not** claim endorsement, partnership, authorization, or affiliation with Donald Trump, the Trump Organization, CIC Digital, Fight Fight Fight LLC, or any token issuer, and it does not claim that TRUMP is legal tender.

The integration never receives private keys, signs, broadcasts, automates a transaction, or provides custody. A user-controlled wallet must independently review and sign any future transaction.

Configured Solana mint: `6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN`.

Treat the configured address as an integration identifier only. This module does not provide investment advice, a price forecast, political advocacy, or a recommendation to buy, sell, hold, or transfer any asset.
