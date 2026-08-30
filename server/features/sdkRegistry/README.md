# SkySDKRegistry (#165)

SkySDKRegistry is a bounded engineering-beta SDK metadata registry for SKYCOIN4444. It normalizes SDK identity/language metadata, validates semver-like versions and HTTPS documentation links, rejects duplicate IDs, and emits `sky.sdk-registry.snapshot.v1`.

## Boundaries

This module is registry/domain logic only. It does not publish packages, generate SDKs, authenticate developers, issue API keys, fetch remote documentation, execute package-manager operations, guarantee compatibility, persist a durable catalog, certify compliance/security, or prove production deployment.
