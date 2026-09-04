# Database Pool Guardrails

## Purpose

SKYCOIN4444 uses one canonical MySQL2 promise pool for the Drizzle-backed server runtime.

The pool now has explicit engineering-beta limits instead of relying on implicit driver defaults. The goal is to bound connection creation and in-process connection waiting while keeping the existing `DATABASE_URL` URI contract intact.

## Driver patch level

The canonical dependency is pinned through the frozen lockfile to MySQL2 3.23.3.

This patch is intentionally adopted because upstream 3.23.3 includes fixes relevant to the runtime pool boundary, including keeping `connectTimeout` active through the handshake, giving each pooled connection its own configuration copy, and propagating pool query-dispatch errors instead of throwing them outside the expected path.

The dependency upgrade does not by itself prove database availability or performance; canonical exact-head CI and deployment-specific database verification remain required.

## URI preservation

The pool is created with an options object containing `uri: DATABASE_URL` plus explicit pool overrides.

MySQL2 v3.23.3 supports `uri` as a connection option and merges URI-derived connection settings into the object before applying explicit values. This preserves supported connection-string options while allowing SKYCOIN4444 to set pool-specific bounds.

No database credential is parsed into logs or diagnostics.

## Default bounds

The canonical defaults are:

- `DB_POOL_CONNECTION_LIMIT=10`
- `DB_POOL_MAX_IDLE=10`
- `DB_POOL_IDLE_TIMEOUT_MS=60000`
- `DB_POOL_QUEUE_LIMIT=256`
- `DB_CONNECT_TIMEOUT_MS=10000`
- `DB_KEEP_ALIVE_INITIAL_DELAY_MS=0`

The pool always:

- waits for a connection while the bounded queue has room;
- enables TCP keepalive;
- rejects an unlimited queue configuration.

## Validation

Startup validation enforces:

- connection limit: 1–100;
- max idle: 0–100 and not greater than the connection limit;
- idle timeout: 1–600 seconds;
- queue limit: 1–10,000;
- connect timeout: 0.5–60 seconds;
- keepalive initial delay: 0–60 seconds.

Invalid values fail fast rather than silently falling back to a weaker or unbounded configuration.

## Pressure behavior

When every pool connection is busy, MySQL2 queues connection requests until `DB_POOL_QUEUE_LIMIT` is reached.

After that bound is reached, additional acquisition attempts fail rather than creating an unbounded in-process queue.

This is a database-client bulkhead. It does not replace:

- the HTTP in-flight request limit;
- query-level timeouts;
- managed-database connection quotas;
- replica-level capacity planning.

## Telemetry

The pool observes MySQL2 acquire, release, and enqueue events.

`GET /api/runtime/database-pool`

returns:

- configured/closed state;
- connection limit;
- max idle;
- idle timeout;
- queue limit;
- connect timeout;
- keepalive settings;
- active acquired connections;
- active high-water mark;
- total acquire events;
- total release events;
- total enqueue events;
- `productionDatabaseVerified: false`.

The route does not return:

- `DATABASE_URL`;
- database hostname;
- username;
- password;
- database name.

The event counters are local process telemetry. They are not a provider-side authoritative count and may not describe other replicas.

## Capacity planning

Before enabling an invitation beta against a managed database, record:

1. the provider's maximum connection quota;
2. the maximum application replica count;
3. `DB_POOL_CONNECTION_LIMIT`;
4. reserved headroom for migrations, operators, provider agents, and other services.

A simple upper-bound estimate is:

`application replica ceiling × DB_POOL_CONNECTION_LIMIT`

That value must remain below the provider quota with deliberate operational headroom.

The repository cannot verify an external managed-database quota by itself.

## Shutdown

The canonical coordinated shutdown closes the MySQL pool only after background event dispatch has stopped and HTTP drain has completed.

Pool close is idempotent. See `docs/SHUTDOWN.md`.

## Limitations

These guardrails do not establish:

- production database availability;
- query cancellation;
- transaction timeouts;
- replica autoscaling safety;
- managed-provider quota correctness;
- database failover;
- backups or restore readiness;
- production performance certification.

They are process-local engineering-beta database connection controls.
