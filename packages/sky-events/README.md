# SkyEvents

SkyEvents is a bounded engineering-beta event domain core for SKYCOIN4444.

## Capability

- validates and normalizes event identifiers, types, actors, subjects, and ISO-8601 timestamps;
- provides deterministic event filtering and ordering;
- emits the provider-neutral `sky.events.published.v1` integration contract;
- includes focused deterministic tests.

## Integration contract

`sky.events.published.v1` carries normalized event metadata and optional application payload for in-process adapters, audit consumers, feeds, notification planners, analytics pipelines, or future durable event transports.

## Security and product boundaries

This package does **not** provide a durable event store, broker, exactly-once delivery, authorization, tenant isolation, schema registry, webhook delivery, distributed ordering, external provider integration, replay guarantees, production deployment, or compliance certification. Callers must authorize event publication/consumption and avoid placing secrets or unnecessary sensitive data in payloads.
