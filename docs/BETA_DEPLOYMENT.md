# SKYCOIN4444 Invitation Beta Deployment

This document defines the first deployable engineering-beta contract. It does **not** claim that a public beta is currently deployed.

## Release model

The target is one invitation-only web service backed by a dedicated managed MySQL beta database. The deployment must fail closed when identity, database, session, public-origin, or invitation configuration is incomplete.

The repository contains a Render web-service blueprint in `render.yaml`. That blueprint does not provision or certify a database, OAuth provider, DNS, TLS, backups, or monitoring by itself.

## Required production configuration

Before starting `pnpm start` with `NODE_ENV=production`, configure:

| Variable | Requirement |
| --- | --- |
| `PORT` | Exact integer listener port from 1–65535. Production never scans for an alternate port. |
| `DATABASE_URL` | Remote `mysql://` URL naming a dedicated beta database; localhost is rejected. |
| `JWT_SECRET` | Active HS256 signing/verification secret; at least 32 bytes. |
| `JWT_SECRET_PREVIOUS` | Optional verification-only previous secret during a controlled rotation; at least 32 bytes and different from `JWT_SECRET`. |
| `SESSION_TTL_MS` | Absolute stateless session lifetime, 900000–2592000000 ms; default beta configuration is 604800000 ms (7 days). |
| `VITE_APP_ID` | Approved application identifier used by server and client session/OAuth flow. |
| `OAUTH_SERVER_URL` | HTTPS OAuth service URL. |
| `VITE_OAUTH_PORTAL_URL` | HTTPS browser login portal URL. |
| `BETA_PUBLIC_ORIGIN` | Exact HTTPS deployment origin, with no path or query. |
| `BETA_ACCESS_MODE` | Must be `invite_only` in production. |
| `OWNER_OPEN_ID` | Optional owner admission identity. |
| `BETA_ALLOWED_EMAILS` | Optional comma-separated invited OAuth emails. |
| `BETA_ALLOWED_OPEN_IDS` | Optional comma-separated invited OAuth open IDs. |
| `LOCAL_TEST_MODE` | Must be false in production. |

At least one owner/open-ID/email invitation must be configured. Missing or invalid configuration stops the production server rather than exposing a partial beta.

## Startup and port binding

Production startup treats `PORT` as an exact deployment contract. It validates the value as an integer from 1 through 65535 and does not probe or silently move to another port.

The HTTP listener is wrapped in a Promise that resolves only after the server emits `listening`. Runtime readiness is marked only after that event. If bind fails, including `EADDRINUSE`, startup rejects instead of advertising a different port.

Startup failures set process exit code 1, emit a bounded credential-redacted error summary, and attempt to close the canonical MySQL pool.

Development may use bounded fallback scanning through `DEV_PORT_FALLBACK_SPAN`. That setting is ignored for production fallback behavior.

See `docs/STARTUP.md`.

## Observability trust boundary

The deployed service must treat application-generated request IDs as canonical. Caller-provided `X-Request-ID` values are optional untrusted correlation metadata only and are accepted only under a restricted bounded syntax.

Operational error summaries use the shared redactor before application logging. OAuth callback/auth synchronization failures and outbox dispatcher failures do not intentionally log raw provider/database error objects, and outbox failure text is sanitized before durable `last_error` persistence.

This is targeted application-level redaction, not proof that hosting-platform, Node-generated, database-provider, or third-party logs can never contain sensitive information.

See `docs/OBSERVABILITY.md`.

## Fatal runtime behavior

The canonical server synchronously observes Node `uncaughtExceptionMonitor` events and emits one bounded credential-redacted record containing the fatal origin and summary.

The application intentionally does not install an `uncaughtException` or `unhandledRejection` recovery listener. A fatal exception therefore remains fatal under Node's default behavior.

If a deployment relies on automatic restart after a process crash, that restart policy must be configured and verified in the hosting environment. This repository does not claim such an external supervisor is active.

See `docs/FATAL_RUNTIME.md`.

## Database pool guardrails

The canonical MySQL2 client now uses explicit bounded pool settings instead of relying on driver defaults.

Default engineering-beta values:

- connection limit: 10;
- maximum idle: 10;
- idle timeout: 60 seconds;
- connection-request queue limit: 256;
- connect timeout: 10 seconds;
- TCP keepalive: enabled;
- keepalive initial delay: 0.

All numeric values are bounded and validated during module startup. `DB_POOL_MAX_IDLE` cannot exceed `DB_POOL_CONNECTION_LIMIT`, and `DB_POOL_QUEUE_LIMIT=0` is rejected because the canonical beta does not permit an unbounded connection-wait queue.

`GET /api/runtime/database-pool` exposes only non-secret configuration and event-based acquire/release/enqueue counters. It never returns the database URL, host, user, password, or database name.

These application limits must still be sized against the managed database's actual connection quota and the number of application replicas. Source code cannot prove that external quota.

See `docs/DATABASE_POOL.md`.

## First managed database bootstrap

The historical SQL files predate the current runtime schema and must not be replayed blindly against a new managed beta database.

For a **brand-new empty beta database only**:

1. Create a dedicated empty MySQL database and record its owner, environment, retention/backups policy, and connection boundary.
2. Set `DATABASE_URL` to that database.
3. Independently verify that the target is disposable and contains no existing tables or user data.
4. Set `BETA_DB_BOOTSTRAP_CONFIRM=EMPTY_BETA_DATABASE`.
5. Run:

```bash
pnpm beta:db:bootstrap
```

The bootstrap refuses localhost, refuses any non-empty database, synchronizes from canonical `drizzle/schema.ts`, and verifies core account/feedback/course/social/audit tables. It creates no seed users, balances, transactions, wallet state, or provider data.

For any non-empty database, do **not** use this command. Prepare and review a forward migration against the exact existing schema instead.

## Production session cookie migration

Production browser authentication uses `__Host-app_session_id` rather than the legacy unprefixed `app_session_id`.

The production cookie is:

- Secure;
- HttpOnly;
- `Path=/`;
- host-only because no Domain attribute is set;
- `SameSite=None` for the current OAuth/runtime compatibility boundary.

The legacy cookie is not accepted for production authentication. Successful login and logout clear it as cleanup. A deployment moving from the earlier unprefixed cookie should therefore expect some existing browser sessions to re-authenticate.

Deployment verification should inspect the `Set-Cookie` metadata without recording the JWT value and confirm the active session cookie name begins with `__Host-`, includes Secure and Path=/, and has no Domain attribute.

This source behavior does not prove a hosting proxy, browser fleet, or deployed origin is configured correctly.

## Session signing-key rotation

The canonical session verifier supports one bounded overlap key:

- `JWT_SECRET` signs all newly issued sessions and verifies current sessions;
- optional `JWT_SECRET_PREVIOUS` verifies sessions issued under the immediately previous key;
- the previous key is never used for new signatures;
- duplicate active/previous secrets and short secrets fail production configuration validation.

A controlled rotation is:

1. record the current active secret as key A in the deployment secret manager;
2. generate a new independent key B;
3. deploy B as `JWT_SECRET` and A as `JWT_SECRET_PREVIOUS`;
4. verify new sessions are issued and old sessions behave according to the intended overlap policy;
5. after the chosen compatibility window, remove `JWT_SECRET_PREVIOUS`;
6. verify tokens signed only by A no longer authenticate.

Removing the previous key intentionally invalidates any still-unexpired token signed by it. If uninterrupted compatibility for all old sessions is required, the overlap must cover the maximum remaining lifetime of those sessions. Older releases historically issued longer-lived sessions, so an operator must not assume the current seven-day default describes every token minted before the cutover.

This repository does not automate rotation timing or secret-manager changes.

See `docs/SESSION_KEY_ROTATION.md`.

## Session lifetime

The canonical OAuth session uses one shared absolute lifetime for both the signed JWT expiration and the session-cookie `Max-Age`.

`SESSION_TTL_MS`

- default engineering-beta value: 604800000 ms (7 days);
- minimum: 900000 ms (15 minutes);
- maximum: 2592000000 ms (30 days).

Invalid production values fail configuration validation before the server becomes ready.

The SDK applies the same hard bounds to any caller-requested session expiration so another internal call site cannot silently issue a year-long token.

These sessions are currently stateless signed JWTs. Logout clears the browser cookie, and invitation admission is re-checked on authenticated requests, but a copied valid JWT is not backed by a server-side revocation record and remains cryptographically valid until its expiration unless the signing secret is rotated.

The separate `SkySessions` package is a domain core and is not claimed as the persistence/revocation backend for the canonical OAuth session.

See `docs/SESSION_SECURITY.md`.

## Identity and admission behavior

The browser sign-in route never accepts a SKYCOIN4444 password. Authentication starts only through the configured OAuth provider.

After OAuth returns an identity, the server checks the invitation policy **before** persisting the user or issuing a session. Protected requests re-check the policy, so removal from the allowlist revokes subsequent authorized use even if an old cookie remains in the browser.

Production OAuth callbacks are restricted to `/api/oauth/callback` on the configured `BETA_PUBLIC_ORIGIN`.

## HTTP listener resource limits

The canonical HTTP listener applies explicit process-local limits:

- `HTTP_MAX_HEADERS_COUNT=128`;
- `HTTP_MAX_CONNECTIONS=256`;
- `HTTP_MAX_REQUESTS_PER_SOCKET=1000`;
- `MAX_IN_FLIGHT_REQUESTS=128`.

The header limit bounds parsed request-header cardinality. The connection limit bounds simultaneously accepted TCP connections for this single-process Node server; connections arriving beyond that threshold are closed/dropped by Node rather than admitted into an unbounded listener set. The in-flight request gate remains a separate application-level limit.

`GET /api/runtime/state` exposes these non-secret configured limits.

These values are engineering-beta defaults and must still be reviewed against real traffic, reverse-proxy behavior, hosting quotas, and any future multi-process/cluster architecture.

## Shared readiness behavior

The canonical server now uses one dependency-readiness assessor for both `/api/runtime/ready` and `/api/beta/readiness`.

Required readiness currently covers production configuration and database reachability. Database probing is timeout-bounded and short-lived results are cached to avoid health-check stampedes. The optional internal event dispatcher is reported as disabled/ok/degraded but does not currently gate required readiness.

See `docs/READINESS.md` for the exact contract and limitations.

## Coordinated shutdown behavior

The canonical process has one SIGTERM/SIGINT owner. Deployment shutdown first makes readiness false, then stops the optional internal outbox dispatcher, drains HTTP, and finally closes the MySQL pool. Per-resource cleanup is bounded by `SHUTDOWN_RESOURCE_TIMEOUT_MS`; HTTP drain keeps its separate `SHUTDOWN_GRACE_MS` bound.

`GET /api/runtime/shutdown` exposes a non-secret shutdown phase/error-count snapshot for engineering diagnostics. This source-level behavior is not evidence that a deployment platform has been configured with a sufficient termination grace period; that platform setting must still be verified separately.

See `docs/SHUTDOWN.md`.

## Dead-letter operations

If the internal outbox dispatcher is enabled for a deployment, administrators have a bounded tRPC recovery surface:

- `eventOperations.deadLetters` for metadata-only inspection;
- `eventOperations.replayDeadLetter` for one-event guarded replay with atomic audit.

The API does not return event payloads or raw stored error strings. There is no automatic replay, bulk replay, or dedicated operations UI. A beta operator should record why a replay was requested outside the API if human-readable incident context must be retained; the application stores only a digest of the supplied reason.

## Deployment verification

A candidate deployment is not beta-ready until all of these are recorded:

1. exact merged `main` SHA;
2. exact-head CI success;
3. managed database bootstrap or reviewed forward migration evidence;
4. Render/service deployment identifier, HTTPS URL, and exact configured listener `PORT`;
5. deployment logs/evidence show the service bound that exact production port without fallback;
6. `/api/beta/health` returns `status=ok`;
7. `/api/runtime/ready` returns HTTP 200 with required dependency status `ready`;
8. `/api/beta/readiness` returns `status=ready`, `database=ok`, and `configuration=ok`;
9. an invited account can complete OAuth and load a protected route;
10. an uninvited account is denied without receiving a session;
11. profile update survives refresh;
12. one social or SkySchool action survives refresh;
13. beta feedback reaches durable storage;
14. `/data-export` returns only the authenticated tester's integrated beta data and states its coverage boundary;
15. `/delete-account` records a durable request and does not claim deletion completion;
16. rollback target, privacy-request owner, and response owner are recorded.

## Privacy operations

The engineering beta provides an authenticated self-export over currently integrated account/profile, social, learning, feedback, discovery, creator, notification, and privacy-request tables. The export explicitly does not claim exhaustive coverage of unintegrated legacy or external-provider systems.

Account deletion is currently a **request-and-review workflow**. A tester can record a durable request and see its status. Administrators can approve or reject the request with an operator note. The application intentionally has no API action that marks a request completed, because an automated verified purge across all account-related tables has not yet been implemented. A beta operator must not tell a tester that deletion is complete without separate purge evidence.

## Explicit limits

This deployment contract does not enable or prove payment settlement, banking, custody, signing, wallet transfers, token issuance, staking, mining, mainnet blockchain writes, regulatory approval, provider-backed AI, livestream ingest/CDN delivery, production-grade security certification, or uninterrupted availability.
