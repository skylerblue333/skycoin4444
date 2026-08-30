# SkyVector (#93)

SkyVector is a bounded, provider-neutral vector similarity core for SKYCOIN4444. It validates finite numeric vectors, computes cosine similarity, performs deterministic top-K ranking, rejects duplicate record identifiers, and emits the versioned `sky.vector.query.v1` integration contract.

## Product boundaries

This engineering-beta module is in-process only. It does not provide embeddings, an external vector database, durable indexing, distributed search, tenant isolation, authentication, authorization, model-provider connectivity, billing, compliance certification, or verified production deployment. Callers remain responsible for persistence, access control, embedding provenance, dimensionality governance, observability, and scale-out infrastructure.
