# SkyOrganizations (#129)

SkyOrganizations is a bounded engineering-beta organization-domain core for SKYCOIN4444. It provides normalized organization creation, deterministic membership ordering, single-owner invariants, revisioned membership changes, and the versioned `sky.organization.snapshot.v1` integration contract.

## Integration contract

`sky.organization.snapshot.v1` exposes stable organization identity, display name, member count, and revision metadata for downstream products such as SkyTeams, SkyProjects, SkyCRM, and SkyContracts. Those products remain responsible for their own authorization and domain behavior.

## Boundaries

This module is process-local domain logic only. It does not provide authentication, authorization enforcement, tenant isolation, durable persistence, invitations, billing, enterprise directory sync, legal entity verification, compliance certification, audit durability, or verified production deployment.
