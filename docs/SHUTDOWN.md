# Coordinated Application Shutdown

## Purpose

SKYCOIN4444 now has one owner for SIGTERM and SIGINT instead of separate HTTP and outbox signal handlers.

The engineering goal is predictable resource ordering during deploys and process termination:

`draining -> background stop -> HTTP drain -> final resource close`

This is a source-level lifecycle contract. It does not prove that a hosting platform grants enough termination time.

## Sequence

When the first SIGTERM or SIGINT arrives:

1. the application runtime transitions to `draining`;
2. readiness becomes false and the drain guard rejects new ordinary application traffic;
3. background hooks run in registration order;
4. the internal outbox dispatcher stops scheduling new cycles and waits for the currently in-flight cycle;
5. the HTTP shutdown controller closes idle connections, stops accepting new connections, and waits for active requests within `SHUTDOWN_GRACE_MS`;
6. after HTTP drain, final hooks run;
7. the MySQL pool is closed through an idempotent close operation;
8. the coordinator records `stopped` when all cleanup succeeded, or `failed` when one or more cleanup actions failed.

Repeated shutdown requests share one in-flight promise. A later signal does not launch a competing shutdown sequence.

## Bounded resource cleanup

Each non-HTTP hook is individually bounded by:

`SHUTDOWN_RESOURCE_TIMEOUT_MS`

Default: 5000 ms.

A failed or timed-out hook is recorded as an error, but later hooks are still attempted. At the end, failures are surfaced together as an aggregate error and the process exit code is set to failure by the signal handler.

The HTTP server keeps its separate `SHUTDOWN_GRACE_MS` because active connection draining has different timing semantics from resource cleanup.

## Database lifecycle

`server/db.ts` exposes an idempotent `closeDatabasePool()`.

- no configured pool is a no-op;
- a close already in progress returns the same promise;
- a successfully closed pool is not closed twice;
- a failed close clears the in-progress marker so a caller could explicitly retry.

The canonical shutdown coordinator invokes this only after HTTP drain.

This does not prove that all external or legacy data sources use this pool; it applies to the canonical MySQL2 pool in `server/db.ts`.

## Dispatcher lifecycle

The outbox dispatcher no longer owns process signals.

The coordinator calls `outboxDispatcher.stop()` before HTTP drain. That disables future polling and waits for its current cycle.

If the dispatcher hook exceeds its resource timeout, shutdown proceeds to HTTP and database cleanup. The timed-out operation is not magically cancelled; later database closure may cause it to fail naturally. This is a bounded process-exit strategy, not distributed task cancellation.

## Diagnostics

`GET /api/runtime/shutdown`

returns:

- coordinator phase;
- first shutdown reason;
- start/completion timestamps;
- error count;
- registered background/final hook counts;
- `productionAvailabilityClaim: false`.

Raw resource exception details are intentionally not returned.

The route is registered before the drain guard, so it remains queryable while the HTTP server is still draining.

## Hosting-platform requirement

A deployment platform's termination grace window must exceed the application's chosen shutdown bounds with operational margin.

Repository code cannot prove or configure every platform's termination policy. Record that external setting in release evidence.

## Limitations

This coordination does not establish:

- distributed drain coordination across replicas;
- leader election;
- cancellation of arbitrary in-flight database queries;
- guaranteed zero request loss under forced termination;
- production availability certification;
- a deployed platform termination policy.

It is an engineering-beta lifecycle and resource-cleanup contract.
