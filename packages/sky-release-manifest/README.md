# SkyReleaseManifest — Wave 1 slot #60 recovery assignment

This package is the transparent recovery implementation for historical Wave 1 slot **#60**.

Issue #27's historical audit could not recover an authoritative original product/repository identity for slot #60 after collision-safe searches. This package therefore does **not** claim to be that lost historical identity. It is a newly assigned recovery product created during the #1–#144 completion audit to close the documented numbering/evidence gap without rewriting history.

## Capability

`createReleaseManifest()` builds a deterministic, immutable release/component manifest from versioned components and immutable Git-style revision digests. It validates identifiers, semantic-version-like versions, release stages, duplicate IDs, dependency references, self-dependencies and dependency cycles. Canonical ordering and SHA-256 digesting make equivalent manifests deterministic across caller ordering.

## Integration contract

Import `createReleaseManifest` from `src/index.ts`. Components declare a stable ID, version, immutable 40- or 64-character lowercase hexadecimal revision, bounded stage, and optional dependencies on other components in the same manifest.

The output schema is `sky.release.manifest.v1` with canonical component ordering and a deterministic SHA-256 digest.

## Truth boundary

This is an engineering-beta release-manifest domain core. A `verified-build` stage is caller-supplied metadata validated only as an allowed enum value; this package does **not** independently verify CI, source provenance, signatures, artifacts, deployments, infrastructure, security, compliance, blockchain state, payment execution, external providers, or production readiness. Durable storage, authorization, signing/attestation, artifact transparency logs and deployment promotion remain integration responsibilities.
