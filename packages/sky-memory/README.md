# SkyMemory (#94)

SkyMemory is a bounded, deterministic in-process memory record core for SKYCOIN4444 Wave 2. It supports validated record insertion and namespace/tag filtering with deterministic ordering.

## Integration contract

`sky.memory.search.v1` returns a normalized namespace and cloned matching records. Records normalize timestamps and tags and enforce unique IDs.

## Boundaries

This package is process-local and in-memory only. It does **not** provide durable persistence, embeddings/vector search, semantic ranking, encryption at rest, authorization/tenant isolation, cross-process replication, retention policy enforcement, backup, compliance certification, or production deployment guarantees.

## Verification

Focused tests cover deterministic search ordering, tag normalization, namespace filtering, duplicate IDs, timestamp validation, and query limits. Dedicated CI runs package typecheck, focused tests, and critical dependency audit.
