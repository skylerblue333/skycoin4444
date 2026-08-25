# SkyContracts — Slot #134 / Lane 02

SkyContracts is an **engineering-beta contract metadata and lifecycle library**.

It validates organization/counterparty identifiers, title length, effective and optional expiry timestamps, lifecycle status, and an optional caller-supplied document digest.

## Integration contract

SkyOrganizations, SkyProjects, or SkyApprovals may reference a `ContractRecord` by ID and use `isContractInForce` for deterministic application workflow decisions. Persistence, authorization, and document storage belong to separate platform layers.

## Security and truth boundaries

SkyContracts does not provide legal advice, establish legal enforceability, verify signatures, perform e-signing, prove signer identity, notarize documents, or prove that a document digest corresponds to an authentic agreement. Those responsibilities require separately verified legal and technical integrations.

Tests cover metadata validation, active windows, termination, and malformed digest rejection.
