# SkyKnowledge (#89)

Bounded engineering-beta knowledge-domain core for deterministic article lifecycle and local text search.

## Capability

- validated article identifiers, titles, bodies, and normalized tags
- draft -> published -> archived lifecycle with terminal archival
- deterministic version increments for publish/revise/archive operations
- deterministic local search over published title/body/tag text
- focused tests and package test/typecheck scripts
- provider-neutral event contract: `sky.knowledge.changed.v1`

## Boundaries

This package does **not** provide semantic/vector search, embeddings, web crawling, document ingestion, external knowledge providers, durable persistence, tenant authorization, production deployment, or compliance certification. Search is deterministic process-local substring matching only.
