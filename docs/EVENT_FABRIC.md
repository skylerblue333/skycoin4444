# SKYCOIN4444 Event Fabric

## Purpose

The event fabric gives SKYCOIN4444 a durable, versioned contract for recording cross-domain facts without claiming that an external broker, stream processor, or production delivery system already exists.

It separates three concerns:

1. **Domain event contract** — deterministic event type, schema version, aggregate identity, correlation/causation identifiers, actor, bounded JSON payload, and metadata.
2. **Transactional persistence** — business mutations can insert an outbox event in the same database transaction as the business row.
3. **Delivery planning** — retry/dead-letter logic and idempotency contracts exist as reusable engineering primitives, while external transport remains explicitly unconfigured.

## Canonical event registry

The current registry contains:

- `social.post.created` v1
- `social.follow.created` v1
- `beta.feedback.submitted` v1

Registry definitions are normalized and SHA-256 fingerprinted. Reordering equivalent descriptors does not alter the fingerprint. This gives release tooling a stable contract identifier.

The diagnostic route is:

- `GET /api/platform/events/registry`

It intentionally reports:

- durable outbox schema: present;
- idempotency ledger schema: present;
- whether the optional internal dispatcher is enabled;
- the internal consumer name;
- durable consumer receipts: present;
- external transport/broker: not configured;
- production external-delivery claim: false.

## Transactional outbox

`drizzle/schema.ts` and migration `0010_event_fabric.sql` define `event_outbox`.

Selected mutations now write business state and the corresponding outbox event in one Drizzle transaction:

- social post creation writes `posts` + `social.post.created`;
- social follow creation writes the unique `follows` edge + notification + `social.follow.created`;
- engineering-beta feedback writes `beta_feedback` + `audit_ledger` + `beta.feedback.submitted`.

This removes a common dual-write failure mode: the mutation cannot successfully commit its business state while independently losing the event row in the same database transaction.

Other social multi-write operations were also tightened:

- comment creation + post comment counter update;
- like creation + post like counter update;
- unlike removal + counter decrement;
- post deletion + associated likes/comments deletion.

These operations are transactionally grouped, but this does **not** prove serializable behavior under every concurrent race. The canonical schema now enforces unique non-null like edges on `(post_id, user_id)` and unique non-null follow edges on `(follower_id, following_id)`; migration `0011_social_consistency.sql` also reconciles like counters after deduplication.

## Event envelope

The event library validates and bounds:

- event type syntax;
- positive schema versions;
- stable producer and aggregate type names;
- aggregate and correlation identifiers;
- optional causation, actor, and idempotency identifiers;
- metadata entry count and key/value size;
- finite JSON numbers;
- payload size.

Payload objects are canonicalized recursively before hashing or durable storage, so equivalent key ordering produces the same canonical representation.

## Idempotency contract

The database schema also defines `idempotency_records`, keyed by scope + idempotency key.

The pure decision contract distinguishes:

- execute;
- request already in progress;
- replay a completed result;
- conflict when the same key is reused for a different request hash;
- execute again after expiry or an explicitly failed record.

The schema and decision logic are foundations. Only the explicitly documented create mutations are currently wired to durable replay, so the presence of the table must not be represented as universal idempotent request handling.

## Mutation idempotency

The durable `idempotency_records` table is now used by two canonical create-type mutations:

- `social.post.create`;
- `beta.feedback.submit`.

Clients may send the standard `Idempotency-Key` header. `X-Idempotency-Key` is accepted as a compatibility alias; if both are sent they must be identical.

Keys are validated as bounded URL-safe identifiers and scoped to a SHA-256-derived actor identity, so two different accounts may safely use the same client-generated key without sharing a replay record. The request hash is computed from the actor-scoped operation plus canonical JSON input.

For an idempotent request, one database transaction contains:

1. reservation of the unique `(scope, idempotency_key)` record;
2. the business write;
3. related audit/outbox writes;
4. storage of the bounded successful response;
5. transition of the idempotency record to `completed`.

If a concurrent/retried request collides with the reservation:

- the same key + same canonical request replays the stored completed response;
- the same key + different request returns a conflict;
- an in-progress or malformed persisted record fails closed rather than duplicating the write.

The domain event receives a separate SHA-256 idempotency fingerprint derived from the actor scope + client key. This avoids global outbox collisions when different accounts choose the same raw key.

Idempotency records currently have no automatic expiry/garbage-collection policy. The current beta therefore treats completed keys as durable replay records until an explicit retention policy is designed and tested. Failed/expired record reclamation is not claimed; callers should use a new key if a record cannot be safely replayed.

## Internal outbox dispatcher

Migration `0012_outbox_dispatcher.sql` adds lease ownership, a dispatch lookup index, and durable `event_consumer_receipts`.

The optional runtime dispatcher is disabled by default. When `EVENT_OUTBOX_DISPATCHER_ENABLED=true`, it:

1. selects currently eligible `pending`, `retry`, or expired-`leased` rows in bounded batches;
2. acquires each row through an optimistic database update that requires the row to still be eligible;
3. assigns an opaque short-lived lease owner and lease expiry;
4. invokes the internal `platform-event-observer` consumer;
5. writes an idempotent durable consumer receipt and one deterministic event-observation metric inside one transaction;
6. marks the outbox row `published` only after consumer success;
7. applies deterministic exponential retry on failure;
8. moves the row to `dead_letter` after the configured maximum attempts.

Consumer receipts make the current internal observer retry-safe: if a crash occurs after the consumer transaction succeeds but before the outbox row is marked published, a later lease may invoke the consumer again, but the unique `(event_id, consumer)` receipt prevents the observer side effect from being counted twice.

The dispatcher remains process-local polling against the shared database. It does not claim an external broker or stream transport.

Therefore:

- no external delivery latency is claimed;
- no exactly-once external delivery is claimed;
- no broker durability is claimed;
- no cross-region delivery guarantee is claimed;
- no automatic dead-letter replay UI or operator workflow is claimed.

The pure dispatch engine, database repository, retry planner, and runtime diagnostics are reusable foundations for a future verified external transport.

## Verification

Tests cover:

- deterministic event registry fingerprints;
- canonical JSON and payload hashes;
- bounded event-envelope construction;
- outbox-row mapping;
- oversized payload rejection;
- idempotency execute/replay/conflict/in-progress behavior;
- retry and dead-letter planning;
- lease loss handling;
- bounded dispatcher configuration;
- internal-only transport diagnostics;
- truthful server registry boundaries.

The canonical repository CI still provides the authoritative exact-head evidence for type checking, linting, credential scanning, marker auditing, tests, integration tests, production build, and production-dependency audit.
