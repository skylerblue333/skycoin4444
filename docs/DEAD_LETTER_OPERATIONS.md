# Dead-Letter Operations

## Purpose

SKYCOIN4444 provides a narrow admin-only recovery API for transactional outbox events that exhausted their normal retry budget.

The surface is intentionally manual and bounded. It is not a general event browser, a payload viewer, or an automatic replay system.

## Authorization

Both procedures are built on the canonical `adminProcedure`.

- signed-out callers receive `UNAUTHORIZED`;
- authenticated non-admin callers receive `FORBIDDEN`;
- only accounts whose persisted role is exactly `admin` may reach the database operations.

This is application authorization, not a claim of external identity proofing or privileged-access certification.

## Metadata inspection

`eventOperations.deadLetters`

accepts a bounded limit from 1 to 100 and returns only rows whose state is exactly `dead_letter`.

Returned fields are limited to:

- event ID;
- event type;
- schema version;
- producer;
- aggregate type;
- aggregate ID;
- attempt count;
- available timestamp;
- created timestamp.

The query does not select:

- event payload;
- event metadata JSON;
- raw `last_error`;
- actor identity;
- idempotency key;
- correlation/causation IDs.

The response explicitly reports `payloadExposed=false`, `rawErrorExposed=false`, and `automaticReplay=false`.

## Manual replay

`eventOperations.replayDeadLetter`

requires:

- one exact event ID;
- one bounded reason between 5 and 255 characters.

The mutation uses one database transaction. It first reads the row only under `state=dead_letter`, then updates with the same state predicate.

A successful replay changes:

- state: `dead_letter -> retry`;
- attempts: reset to `0`;
- available time: current time;
- lease owner/expiry: cleared;
- published time: cleared;
- stored last error: cleared.

Resetting attempts deliberately grants a fresh configured retry budget. The previous attempt count is retained in the audit details.

If another operator or worker changes the state before the compare-and-set update, the mutation fails with `CONFLICT` and no audit row is committed.

## Atomic audit

The replay update and audit insertion occur in the same transaction.

The audit row records:

- acting administrator ID through `user_id`;
- event type `event_outbox_dead_letter`;
- action `replay_requested`;
- target event ID/type;
- previous attempt count;
- SHA-256 digest of the supplied replay reason;
- success status.

The raw operator reason is not copied into `audit_ledger`.

Human-readable incident context should live in the approved operational incident system, if one is configured. This repository does not claim such an external system exists.

## Idempotent consumer interaction

The current internal `platform-event-observer` already writes a unique `(event_id, consumer)` receipt.

If a replay occurs after the observer side effect succeeded but the outbox state became uncertain, receipt uniqueness prevents that observer metric from being counted twice.

This protection applies to the current observer only. Future external consumers must implement and verify their own idempotency behavior.

## Deliberate exclusions

This release does not provide:

- event payload viewing;
- raw error viewing through the admin API;
- bulk replay;
- automatic replay;
- replay scheduling for a future clock time;
- replay approval chains;
- dead-letter deletion;
- dead-letter mutation for non-admin users;
- dedicated operator UI;
- external broker operations.

These exclusions keep recovery narrow while the platform remains an engineering beta.

## Verification

Focused tests cover:

- metadata-only summary construction;
- absence of payload and raw-error fields;
- hashing of the operator reason before audit persistence;
- signed-out rejection;
- non-admin rejection.

Canonical exact-head CI remains required before merge and supplies the repository-wide typecheck, lint, test, integration, build, marker, secret-scan, and dependency-audit evidence.
