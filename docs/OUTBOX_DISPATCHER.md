# Durable Outbox Dispatcher

## Purpose

SKYCOIN4444 now has an optional internal dispatcher for the transactional event outbox. It converts durable event rows into bounded, retryable internal processing without claiming that Kafka, SQS, NATS, Redis Streams, webhooks, or another external transport has been configured.

The feature is disabled by default.

## Enablement

Set:

`EVENT_OUTBOX_DISPATCHER_ENABLED=true`

Optional bounded controls:

- `EVENT_OUTBOX_POLL_MS` — polling interval;
- `EVENT_OUTBOX_BATCH_SIZE` — maximum rows considered per cycle;
- `EVENT_OUTBOX_LEASE_MS` — lease duration;
- `EVENT_OUTBOX_MAX_ATTEMPTS` — retry ceiling before dead-letter;
- `EVENT_OUTBOX_BASE_DELAY_MS` — exponential retry base;
- `EVENT_OUTBOX_MAX_DELAY_MS` — retry delay cap.

Invalid values fail at server startup rather than silently weakening the dispatcher boundary.

## Lease model

The database schema stores:

- state;
- attempts;
- available time;
- lease expiry;
- opaque lease owner;
- publication time;
- last bounded error.

The dispatcher first reads eligible candidates, then attempts an update that repeats the eligibility predicate and assigns its lease token. A second worker racing on the same row cannot claim it after the first worker has moved it to a non-expired `leased` state.

Expired leases are eligible for recovery.

This is an optimistic database lease, not a distributed lock service.

## Internal consumer

The current consumer is:

`platform-event-observer`

For each event, one database transaction writes:

- a unique `event_consumer_receipts` record;
- a deterministic `platform_metrics` observation row.

The receipt uniqueness key is `(event_id, consumer)`. If the same outbox event is delivered again after a crash/retry, the receipt collision is treated as already processed and the metric is not duplicated.

This makes the current internal observer idempotent. It does not make arbitrary future consumers idempotent automatically.

## Success path

After consumer success, the worker updates the outbox row from `leased` to `published` only if the row is still owned by the same lease token.

If the lease is lost, the dispatcher does not claim publication success.

## Failure path

Consumer failures are converted into a bounded error string. The platform-kernel backoff primitive determines the next available time.

Rows transition to:

- `retry` while attempts remain;
- `dead_letter` after the maximum attempt count.

The dispatcher does not automatically replay dead-letter rows. Administrators may schedule a single dead-letter row for retry through the bounded `eventOperations.replayDeadLetter` tRPC mutation.

## Manual dead-letter operations

The `eventOperations` tRPC router provides an admin-only recovery surface:

- `deadLetters` returns bounded metadata only;
- `replayDeadLetter` compare-and-sets one row from `dead_letter` to `retry` and records the action atomically in `audit_ledger`.

Payload JSON, metadata JSON, and raw stored errors are not returned by the listing API. Replay reasons are hashed before audit storage.

Replay resets the row's attempt count to zero and clears stale lease/publication/error fields so the normal dispatcher can apply a fresh bounded retry budget. Durable consumer receipts continue to protect the current internal observer from duplicate side effects if an already-processed event is replayed after an uncertain failure.

There is no automatic replay, bulk replay endpoint, or dedicated operator UI.

See `docs/DEAD_LETTER_OPERATIONS.md`.

## Runtime diagnostics

`GET /api/platform/events/dispatcher`

reports non-secret runtime facts including:

- enabled/running state;
- internal consumer;
- cycle counts;
- last cycle counters;
- last failure timestamp;
- bounded dispatcher settings;
- external transport configured: false;
- production external-delivery claim: false.

The registry endpoint `GET /api/platform/events/registry` also reports whether the internal dispatcher is enabled.

## Shutdown behavior

The polling timer is unreferenced so it cannot keep the process alive by itself.

The dispatcher no longer registers its own SIGTERM/SIGINT handler. The canonical application shutdown coordinator owns process signals and invokes `dispatcher.stop()` as the first bounded background-resource hook before HTTP drain begins. That stops future polling and waits for the current dispatch cycle within the configured resource-hook timeout.

This integration does not claim coordinated distributed draining across replicas.

## Limitations

This feature does not establish:

- an external event broker;
- exactly-once delivery;
- cross-region delivery guarantees;
- a production deployment;
- a dedicated dead-letter operator UI or bulk replay workflow;
- distributed leader election;
- a migrated production database.

It is an engineering-beta durable internal processing layer and transport-ready integration contract.
