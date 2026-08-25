# SkyServiceRegistry — Slot #152 / Lane 02

SkyServiceRegistry is an **engineering-beta static service catalog library**.

It validates service identifiers, owners, semantic-version metadata, lifecycle state, relative health paths, and bounded capability lists. It can build a duplicate-free catalog and deterministically query services by declared capability.

## Integration contract

SKYCOIN4444 modules may publish caller-verified `ServiceDescriptor` records into a configuration or persistence layer and use the catalog for developer tooling, capability lookup, health aggregation, or documentation. Existing heartbeat infrastructure may reference a catalog entry, but this library does not call the heartbeat provider or probe endpoints.

## Security and truth boundaries

SkyServiceRegistry is not live service discovery, DNS, Kubernetes control, a load balancer, a health monitor, or production routing enforcement. It does not verify that a declared service actually exists, that a health endpoint is reachable, or that the declared version/capabilities are truthful. Those facts require separately verified runtime integrations.

Tests cover capability normalization, duplicate service IDs, catalog construction, and deterministic capability lookup.
