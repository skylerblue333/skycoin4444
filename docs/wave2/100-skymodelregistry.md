# SkyModelRegistry (#100)

SkyModelRegistry is an engineering-beta registry/domain core for model metadata and lifecycle governance.

## Capability
- model record validation
- unique registration
- deterministic capability/provider selection
- lifecycle transitions between draft, approved, deprecated, disabled

## Integration contract
Callers persist records externally and may use `selectModels` to obtain eligible registry entries for a requested capability. Registry entries describe model/provider metadata only.

## Important limitations
This module does not connect to an AI provider, download models, execute inference, verify provider availability, persist registry state, enforce billing, or claim production deployment/security certification.
