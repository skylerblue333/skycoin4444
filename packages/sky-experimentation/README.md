# SkyExperimentation — Slot #171

SkyExperimentation is an engineering-beta deterministic experiment assignment core. Stable experiment and subject identifiers map into weighted variants without hidden randomness.

## SKYCOIN4444 integration contract

Feature and product adapters may use `assignVariant` after eligibility and consent checks, then persist the selected assignment with their own exposure telemetry.

## Boundaries

This package does not provide statistical analysis, exposure logging, consent enforcement, remote configuration, cryptographic randomness, or production rollout controls. Variant changes can alter future assignments and must be versioned by integrators.
