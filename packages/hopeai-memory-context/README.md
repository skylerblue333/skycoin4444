# HopeAI Memory Context

Engineering-beta bounded memory/context selection core tracked by Issue #146.

## Capability

- validates bounded memory IDs, scopes, content, priorities and timestamps;
- rejects duplicate memory IDs;
- deterministically filters by scope and orders by priority, recency and ID;
- enforces explicit item and character budgets when constructing context.

## Integration contract

Import `validateMemoryItem` and `selectContext` from `src/index.ts`. Callers provide candidate memory items and own persistence, privacy, consent, retrieval and deletion policies.

## Product boundary

This package does **not** persist user memory, access conversations/accounts, infer consent, provide semantic/vector search, encrypt storage, guarantee privacy, connect to an AI model, or implement production data retention. It is a deterministic context-selection library only.
