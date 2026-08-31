# HopeAI Marketplace

Engineering-beta agent/model marketplace domain core tracked by Issue #146.

## Capability

- validates bounded listing/publisher identities, names, prices and capability sets;
- rejects duplicate listing IDs and duplicate capabilities;
- filters to active listings by capability and maximum price;
- returns deterministic price-then-ID ordering.

## Integration contract

Import `validateListing` and `searchListings` from `src/index.ts`. Callers own publisher authentication, payment/credit policy, model/provider integration and persistence.

## Product boundary

This package does **not** host or connect to AI models, process payments, verify publishers, guarantee model quality/safety, execute agents, persist purchases, provide licensing/legal review, or operate a production marketplace. It is a deterministic marketplace-domain library only.
