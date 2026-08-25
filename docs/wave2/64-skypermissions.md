# SkyPermissions (#64)

SkyPermissions is a deterministic authorization domain core for SKYCOIN4444 engineering-beta integrations.

## Capability
- resource/action permission rules with wildcard matching
- deny-overrides evaluation
- context/subject attribute conditions
- rule validation
- default-deny behavior

## Integration contract
Consumers pass a `PermissionRequest` plus an ordered or unordered set of `PermissionRule` objects to `evaluatePermissions`. The evaluator sorts matched rule IDs for deterministic output and returns an explicit decision reason.

## Security boundaries
This module is not an identity provider, policy database, production authorization proxy, compliance control, or durable audit service. Caller identity, rule persistence, tenancy isolation, policy distribution, and enforcement at transport boundaries remain external responsibilities.
