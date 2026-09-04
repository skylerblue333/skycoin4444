# Runtime Guardrails

SKYCOIN4444 now has a bounded HTTP runtime control layer for the engineering beta server. The goal is predictable lifecycle behavior under deploys, shutdowns, and overload without claiming production availability.

## Lifecycle state machine

The runtime has four explicit phases:

1. starting
2. ready
3. draining
4. stopped

The state machine rejects invalid transitions. Shutdown is idempotent: repeated shutdown requests share one in-flight promise instead of racing multiple server closes.

## Health contracts

The server exposes:

- GET /api/runtime/live
- GET /api/runtime/ready
- GET /api/runtime/state

Liveness answers whether the process runtime is still serving. Readiness is true only after the HTTP listener is established and before draining begins. Runtime state includes current concurrency counters.

These endpoints are engineering runtime signals. They are not an SLA, external monitoring proof, or production availability certification.

## Graceful shutdown

SIGTERM and SIGINT are owned by one application shutdown coordinator.

The ordered sequence is:

1. runtime lifecycle moves to `draining`, which immediately makes runtime readiness false;
2. bounded background hooks stop new internal outbox polling and wait for its current cycle;
3. idle HTTP keep-alive connections are closed when supported and the server stops accepting new connections;
4. active HTTP connections receive the configured grace period;
5. after HTTP drain, final resource hooks close the MySQL pool;
6. resource failures are aggregated after later cleanup hooks have still been attempted.

New non-runtime requests receive HTTP 503 with Retry-After once draining begins.

If the HTTP grace period expires, remaining connections are force-closed and the shutdown failure is surfaced. Each non-HTTP resource hook also has its own bounded timeout.

The diagnostic route `GET /api/runtime/shutdown` reports phase, reason, timestamps, hook counts, and error count without exposing raw resource errors.

## Overload protection

A per-process concurrency gate limits the number of in-flight requests. It tracks:

- active request count;
- configured maximum;
- rejected requests;
- observed high-water mark.

When the gate is full, new requests fail fast with HTTP 503 rather than creating unbounded work.

This is deliberately a process-local bulkhead. It is not a distributed rate limiter and does not coordinate across replicas.

## Database pool guardrails

The canonical MySQL2 pool has explicit bounded connection, idle, queue, connect-timeout, and keepalive settings. A finite queue limit prevents connection-wait demand from growing without bound inside the process.

The non-secret route `GET /api/runtime/database-pool` reports configured limits plus acquire/release/enqueue counters and the observed active high-water mark. These counters are process-local event telemetry, not a distributed database metric or managed-provider connection count.

See `docs/DATABASE_POOL.md`.

## HTTP timeout controls

The server explicitly configures request, header, keep-alive, and requests-per-socket limits. Values are bounded and validated at startup.

Optional environment variables:

- HTTP_REQUEST_TIMEOUT_MS
- HTTP_HEADERS_TIMEOUT_MS
- HTTP_KEEP_ALIVE_TIMEOUT_MS
- HTTP_MAX_REQUESTS_PER_SOCKET
- MAX_IN_FLIGHT_REQUESTS
- SHUTDOWN_GRACE_MS
- SHUTDOWN_RESOURCE_TIMEOUT_MS

Invalid or incoherent values fail fast rather than silently weakening the runtime boundary.

## Verification

Unit tests cover lifecycle transitions, overload accounting, configuration validation, HTTP-server option application, and graceful shutdown idempotency. The canonical CI additionally runs the full repository typecheck, lint, test, integration, build, credential scan, marker audit, and dependency audit.
