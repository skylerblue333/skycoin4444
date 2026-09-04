# Idempotent Mutation Replay

## Supported operations

The engineering beta currently supports durable replay protection for:

- social post creation;
- beta feedback submission.

This is intentionally narrower than a claim that every mutation is idempotent.

## Client contract

Send:

`Idempotency-Key: <client-generated-key>`

The compatibility header `X-Idempotency-Key` is also recognized. If both are present, they must match exactly.

Keys:

- are 1–128 characters;
- start with an alphanumeric character;
- may then contain alphanumerics, dot, underscore, colon, or hyphen;
- may not contain surrounding whitespace.

A malformed or conflicting header pair is rejected before creating a resource.

## Actor isolation

The raw client key is not globally unique by itself. The server derives a stable operation scope containing a truncated SHA-256 digest of the authenticated account id.

As a result:

- Account A using key `retry-1` does not collide with Account B using `retry-1`;
- the raw actor id is not stored in the scope string;
- request hashing includes the scoped operation.

## Transaction boundary

When a key is present, resource creation, audit/event side effects, and the completed replay body are written inside one database transaction. A transaction failure rolls all of those writes back together.

The stored successful response is bounded before persistence. A later request with the same scope, key, and request hash decodes and validates that stored response before returning it.

## Conflict behavior

The server fails closed when:

- the same key is reused for different request content;
- an existing record is still marked in progress;
- a completed record is missing or contains an invalid replay body;
- a persisted record has an unsupported state;
- an old/failed record cannot be safely reclaimed.

The caller should use a new key rather than assuming a failed record can be overwritten.

## Event linkage

For keyed create requests, the corresponding outbox event receives a SHA-256 fingerprint derived from the scoped key. This is separate from the raw client key and fits the global `event_type + idempotency_key` outbox uniqueness constraint.

## Limitations

This mechanism does not claim:

- exactly-once execution across external providers;
- idempotency for all tRPC mutations;
- automatic idempotency-record expiry or cleanup;
- safe reclamation of failed/expired records;
- a migrated production database.

It provides durable database-level replay semantics for the explicitly listed engineering-beta operations.
