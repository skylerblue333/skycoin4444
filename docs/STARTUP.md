# Server Startup Contract

## Purpose

SKYCOIN4444 treats server startup as a fail-closed engineering boundary.

A process should not look healthy merely because application setup reached a `server.listen()` call. Production must bind the exact port assigned by the deployment environment, and startup failures must be visible as process failure.

## Port validation

`PORT` is parsed with strict numeric validation.

Allowed range:

- minimum: 1;
- maximum: 65535.

Values such as `3000oops`, decimals, zero, negatives, or ports above 65535 are rejected.

Default when not supplied: 3000.

## Production behavior

When `NODE_ENV=production`:

- `PORT` is the exact listener port;
- no preflight availability scan is used;
- no adjacent-port fallback is attempted;
- a bind error rejects startup.

This is important for hosted environments because load balancers and health checks target the port assigned by the platform. Silently moving to another local port can leave a process running while the deployment is unreachable.

The repository's Render blueprint currently sets `PORT=10000`.

That blueprint is source configuration, not evidence of a deployed Render service.

## Development fallback

When not in production, local development may scan a bounded range beginning at the preferred port.

`DEV_PORT_FALLBACK_SPAN`

Default: 20.

Allowed range: 0–100.

A value of zero disables development fallback.

The scan never exceeds port 65535.

## Listening boundary

The canonical `listenHttpServer()` wrapper:

1. attaches one-time `error` and `listening` listeners;
2. invokes `server.listen(port)`;
3. rejects on synchronous listen failure;
4. rejects on asynchronous server `error` before listening;
5. resolves only after `listening`.

The runtime lifecycle moves from `starting` to `ready` only after this Promise resolves.

The internal outbox dispatcher also starts only after listening succeeds.

## Startup failure

Any rejected `startServer()` call is passed through `handleStartupFailure()`.

The handler:

- sets process exit code to 1;
- logs a bounded startup error summary;
- redacts URI username/password credential segments;
- redacts common password query parameters;
- attempts to close the canonical MySQL pool;
- preserves the failure exit code even when cleanup also fails.

The handler does not claim that every possible third-party resource has been cleaned up. It covers the canonical database resource used by the production server startup path.

## Shutdown distinction

Startup failure and normal runtime shutdown are different paths.

Normal SIGTERM/SIGINT uses the coordinated shutdown sequence documented in `docs/SHUTDOWN.md`.

A failure before the HTTP listener has successfully started does not run a pretend full graceful drain of a server that never became ready. It instead performs startup-specific cleanup and exits unsuccessfully.

## Limitations

This contract does not establish:

- a successful production deployment;
- an externally reachable listener;
- load-balancer configuration;
- DNS or TLS readiness;
- automatic recovery from a bad deployment configuration;
- cleanup of arbitrary external providers;
- zero-downtime deployment behavior.

Those require environment-specific deployment evidence.
