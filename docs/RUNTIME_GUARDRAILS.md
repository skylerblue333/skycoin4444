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

SIGTERM and SIGINT begin a drain:

- readiness becomes false;
- new non-runtime requests receive HTTP 503 with Retry-After;
- idle keep-alive connections are closed when supported;
- the HTTP server stops accepting new connections;
- active connections receive a bounded grace period;
- if the grace period expires, remaining connections are force-closed and the failure is surfaced.

## Overload protection

A per-process concurrency gate limits the number of in-flight requests. It tracks:

- active request count;
- configured maximum;
- rejected requests;
- observed high-water mark.

When the gate is full, new requests fail fast with HTTP 503 rather than creating unbounded work.

This is deliberately a process-local bulkhead. It is not a distributed rate limiter and does not coordinate across replicas.

## HTTP timeout controls

The server explicitly configures request, header, keep-alive, and requests-per-socket limits. Values are bounded and validated at startup.

Optional environment variables:

- HTTP_REQUEST_TIMEOUT_MS
- HTTP_HEADERS_TIMEOUT_MS
- HTTP_KEEP_ALIVE_TIMEOUT_MS
- HTTP_MAX_REQUESTS_PER_SOCKET
- MAX_IN_FLIGHT_REQUESTS
- SHUTDOWN_GRACE_MS

Invalid or incoherent values fail fast rather than silently weakening the runtime boundary.

## Verification

Unit tests cover lifecycle transitions, overload accounting, configuration validation, HTTP-server option application, and graceful shutdown idempotency. The canonical CI additionally runs the full repository typecheck, lint, test, integration, build, credential scan, marker audit, and dependency audit.
