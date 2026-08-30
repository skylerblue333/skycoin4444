# SkyTokenRegistry (#147)

SkyTokenRegistry is a bounded engineering-beta metadata registry for SKYCOIN4444 token definitions. It normalizes token identity and symbols, enforces duplicate-ID and per-network symbol uniqueness, validates decimal metadata, and emits the versioned `sky.token-registry.snapshot.v1` integration contract.

## Boundaries

This module is metadata/domain logic only. It does not create, mint, transfer, price, custody, sign, submit, or monitor blockchain assets or transactions. It performs no wallet authentication, chain RPC/provider calls, contract verification, market-data retrieval, compliance certification, durable persistence, or verified production deployment.
