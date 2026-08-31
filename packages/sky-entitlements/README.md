# SkyEntitlements — Slot #170

SkyEntitlements is an engineering-beta entitlement evaluation domain core. It evaluates exact subject/resource/action grants with optional deterministic expiry.

## SKYCOIN4444 integration contract

Auth, billing, education, marketplace, and organization adapters may translate trusted grants into `EntitlementGrant` records and call `isEntitled` at enforcement boundaries.

## Security and truth boundaries

Inputs are allow-list validated and invalid clocks fail closed. This package does not authenticate callers, issue licenses, persist grants, resolve roles, synchronize clocks, or enforce transport-layer access.

## Validation

Package tests/typecheck/formatting plus repository build/test and production dependency audit are required before merge.
