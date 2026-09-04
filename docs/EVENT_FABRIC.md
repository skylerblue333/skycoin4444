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
- `beta.feedback.submitted` v1

Registry definitions are normalized and SHA-256 fingerprinted. Reordering equivalent descriptors does not alter the fingerprint. This gives release tooling a stable contract identifier.

The diagnostic route is:

- `GET /api/platform/events/registry`

It intentionally reports:

- durable outbox schema: present;
- idempotency ledger schema: present;
- background dispatcher: not configured;
- external transport/broker: not configured;
- production delivery claim: false.

## Transactional outbox

`drizzle/schema.ts` and migration `0010_event_fabric.sql` define `event_outbox`.

Selected mutations now write business state and the corresponding outbox event in one Drizzle transaction:

- social post creation writes `posts` + `social.post.created`;
- engineering-beta feedback writes `beta_feedback` + `audit_ledger` + `beta.feedback.submitted`.

This removes a common dual-write failure mode: the mutation cannot successfully commit its business state while independently losing the event row in the same database transaction.

Other social multi-write operations were also tightened:

- comment creation + post comment counter update;
- like creation + post like counter update;
- unlike removal + counter decrement;
- post deletion + associated likes/comments deletion.

These operations are transactionally grouped, but this does **not** prove serializable behavior under every concurrent race. In particular, the historical `likes` table does not yet enforce a database unique constraint on `(post_id, user_id)`; the application-level duplicate check should not be described as full concurrent duplicate-like protection.

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

The schema and decision logic are foundations. Existing HTTP/tRPC mutations are **not** yet globally wrapped by this ledger, so the presence of the table must not be represented as universal idempotent request handling.

## Retry and dead-letter planning

The event library can plan deterministic exponential retry delays and a final dead-letter state. It reuses the platform-kernel backoff primitive.

No background worker currently leases and publishes outbox rows. Therefore:

- no external delivery latency is claimed;
- no exactly-once delivery is claimed;
- no broker durability is claimed;
- no cross-region or multi-replica event processing is claimed.

A future dispatcher can build on the outbox lease/state fields after a specific transport and operational model is selected and verified.

## Verification

Tests cover:

- deterministic event registry fingerprints;
- canonical JSON and payload hashes;
- bounded event-envelope construction;
- outbox-row mapping;
- oversized payload rejection;
- idempotency execute/replay/conflict/in-progress behavior;
- retry and dead-letter planning;
- truthful server registry boundaries.

The canonical repository CI still provides the authoritative exact-head evidence for type checking, linting, credential scanning, marker auditing, tests, integration tests, production build, and production-dependency audit.
