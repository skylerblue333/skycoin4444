# SkyConfig (#154)

SkyConfig is an engineering-beta configuration resolution domain core.

## Capability
- validates upper-snake-case configuration keys and finite numeric values
- resolves deterministic source precedence: runtime > environment > default
- redacts values marked sensitive for diagnostic output
- reports deterministic configuration diffs

## Integration contract
Callers provide configuration entries and are responsible for sourcing, persistence, transport, authorization, and secret storage. `resolveConfig` is a pure in-process resolver.

## Important limitations
Redaction is a presentation helper, not a secrets vault. This module does not fetch cloud secrets, rotate credentials, encrypt configuration, persist runtime changes, perform remote rollout, or claim production deployment/security certification.
