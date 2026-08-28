# SkySearch (#87)

SkySearch is a bounded engineering-beta lexical search domain core for SKYCOIN4444. It provides deterministic tokenization, weighted ranking, kind/tag filtering, request validation, and the provider-neutral `sky.search.requested.v1` integration contract.

## Integration contract

`createSearchRequest()` produces a metadata-only search request suitable for a future authorized adapter or indexing service. `searchDocuments()` is an in-process deterministic reference implementation useful for tests, local features, and contract validation.

## Security and product boundaries

This package does not crawl external systems, persist or replicate an index, enforce document authorization, protect multi-tenant data, call a hosted search provider, provide semantic/vector search, guarantee relevance quality, or represent a production deployment. Callers must supply only documents the requester is authorized to search and must enforce access control before and after retrieval.
