# SkyCRM (#125)

Bounded engineering-beta CRM contact core for deterministic contact lifecycle operations supplied by the caller.

## Capability

- validates and normalizes contact IDs, names, optional email, status, and tags
- supports versioned contact updates
- provides deterministic local contact search with locale-independent ordering
- includes focused tests and package test/typecheck scripts
- exposes provider-neutral `sky.crm.contact.changed.v1` event identifier

## Boundaries

This package does **not** provide durable CRM storage, email delivery, sales automation, external CRM synchronization, customer identity verification, tenant authorization, analytics, production deployment, or compliance certification. State is caller-managed and process-local.
