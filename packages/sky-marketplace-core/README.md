# SkyMarketplaceCore (#142)

Bounded engineering-beta marketplace listing domain core for SKYCOIN4444 Wave 2 Lane 10.

## Capability

- validates marketplace listing and seller identifiers
- normalizes bounded listing title/description text
- represents price in integer minor units with uppercase three-letter currency codes
- supports deterministic draft/active/paused/closed lifecycle transitions
- supports deterministic repricing with optimistic version increments
- emits provider-neutral `sky.marketplace.listing.changed.v1` integration events

## Truth and security boundaries

This package does **not** perform checkout, payment processing, escrow, tax calculation, shipping, inventory reservation, seller identity/KYC verification, content moderation, fraud detection, durable persistence, tenant authorization, dispute resolution, legal/compliance certification, or production deployment. Callers must enforce authentication, authorization, moderation, payment, inventory, and persistence controls outside this domain core.
