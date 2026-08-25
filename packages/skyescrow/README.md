# SkyEscrow — Wave 2 Slot #79

SkyEscrow is an **engineering-beta escrow state-machine library**. It models validated escrow records and allowed state transitions; it does not hold funds, connect to a payment provider, sign transactions, or enforce legal escrow obligations.

## Domain core

- Validates escrow IDs, distinct buyer/seller IDs, positive integer minor-unit amounts, and 3-letter currency codes.
- Models `draft -> funded -> released`, cancellation, and dispute paths.
- Rejects illegal terminal-state transitions deterministically.
- Uses `bigint` minor units to avoid floating-point money arithmetic.

## SKYCOIN4444 integration contract

A payment or ledger module may call this library after it has independently verified an external financial event. The caller remains responsible for persisting authoritative events and mapping its own transaction IDs to an escrow ID. A SkyEscrow transition is only a domain-state decision; it is not proof that money moved.

## Security / product boundaries

No provider credentials, wallets, bank rails, blockchain execution, custody, identity verification, compliance certification, or production financial enforcement are included. Callers must authorize who may fund, release, cancel, or resolve a dispute before invoking transitions.

## Validation

```sh
pnpm --filter @skycoin/skyescrow test
pnpm run check:packages
pnpm --filter @skycoin/skyescrow format:check
```
