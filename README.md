# SKYCOIN4444

SKYCOIN4444 is a large TypeScript/React engineering project that combines a flagship application runtime with many independently testable domain packages and integration contracts. The current release target is an **engineering beta**, not a production certification.

## Current engineering-beta status

The default branch has a reproducible pnpm workspace and a real CI pipeline. Current required CI covers:

- frozen-lockfile dependency installation;
- root TypeScript validation;
- package-workspace TypeScript validation;
- Vitest tests;
- production client/server build;
- high-severity production dependency audit.

The repository also contains a verified cross-product integration vertical connecting identity, authentication, MFA, permissions, credentials, payment planning, audit, and narrow course/ledger/notification adapters. That integration is intentionally fail-closed at security and financial boundaries.

A typed platform kernel now compiles the canonical capability registry into a dependency-aware DAG, fingerprints the normalized graph, propagates hard/soft degradation, and provides deterministic retry/circuit-breaker primitives plus async request correlation. The server also has an explicit runtime lifecycle with liveness/readiness, graceful drain, bounded HTTP timeouts, and a process-local concurrency bulkhead. These are engineering control-plane foundations; they do not convert registry or runtime state into production certification.

A transactional event fabric now defines versioned domain-event envelopes, a deterministic event-registry fingerprint, a durable database outbox, and idempotency-record contracts. Selected real beta mutations persist their business state and domain event atomically. An optional internal dispatcher can lease, retry, dead-letter, and idempotently observe outbox events through durable consumer receipts; no external event broker or external-delivery guarantee is claimed.

Cookie-authenticated unsafe browser mutations now pass a fail-closed same-origin request boundary in production, and production session cookies are always marked Secure. This is a targeted CSRF/origin defense, not a claim of penetration testing or audited security.

The social beta now has database-enforced uniqueness for likes and follows. Follow creation, its notification, and its domain event commit atomically, while concurrent duplicate likes/follows resolve against named unique constraints instead of relying on race-prone application checks.

Post creation and beta-feedback submission now support actor-scoped, replay-safe `Idempotency-Key` handling backed by the durable idempotency ledger. Matching retries replay the stored response; key reuse with different input fails closed.

The canonical server now applies production CSP/HSTS plus framing, opener, resource, MIME, referrer, permissions, and origin-agent controls. The default HTML no longer contains an implicit analytics-provider hook; analytics must be added as an explicit reviewed integration.

Runtime and beta readiness now share one dependency-readiness assessor with bounded database timeouts, short cache/in-flight deduplication, fail-closed required configuration/database checks, and optional dispatcher degradation reporting.

The server now has a single coordinated shutdown owner: it marks draining first, stops background dispatch, drains HTTP, then closes the MySQL pool, with bounded cleanup hooks and non-secret shutdown diagnostics.

Admin-only dead-letter recovery now exposes metadata-only inspection and single-event compare-and-set replay with atomic audit logging. Event payloads and raw stored errors are not returned, and operator reasons are hashed before audit storage.

The canonical database client now uses a bounded MySQL2 pool with explicit connection, idle, queue, connect-timeout, and keepalive settings. Runtime diagnostics expose only non-secret pool options and pressure counters; the database host, credentials, and URL are never returned.

Production startup now binds the configured `PORT` exactly, marks readiness only after the HTTP server emits `listening`, and converts startup failures into a nonzero process result with database-pool cleanup. Port fallback remains development-only and explicitly bounded.

Runtime-fatal exceptions are synchronously observed through Node's non-interfering `uncaughtExceptionMonitor` event. SKYCOIN4444 writes only a bounded credential-redacted fatal record and deliberately installs no `uncaughtException` or `unhandledRejection` recovery handler, preserving Node's default crash behavior.

The Node HTTP listener now has explicit header-count and TCP-connection caps in addition to request/header/keepalive timeouts, per-socket request limits, and the process-local in-flight request bulkhead.

This evidence does **not** establish production deployment, live banking or payment settlement, custody, blockchain execution, regulatory/compliance approval, external identity verification, live AI-provider connectivity, durable production persistence, TLS/DNS readiness, backup/restore readiness, or audited security.

## One-machine beta test launch

For the fastest local test phase, use Docker Desktop or Docker Engine with Compose. The local path creates only a labeled development account and never targets a production database. The disposable local database is synchronized from the current `drizzle/schema.ts`; historical SQL files are not treated as the canonical local bootstrap.

```bash
git clone https://github.com/skylerblue333/skycoin4444.git
cd skycoin4444
pnpm install --frozen-lockfile
cp .env.local.example .env.local
pnpm local:doctor
pnpm local:up
pnpm local:db
pnpm dev:local
```

In a second terminal, run `pnpm local:smoke`. Then open the printed local URL and exercise `/course-catalog`, `/community-hub`, `/activity-feed`, `/beta-feedback`, `/profile`, and `/beta-web3`. Use `pnpm local:reset` only when you intentionally want to clear the local database. Read [`docs/LOCAL_TEST_PHASE.md`](docs/LOCAL_TEST_PHASE.md) for expected outcomes and recovery steps.

## Invitation beta deployment

The repository now contains a fail-closed production configuration contract, OAuth-only invitation admission, a guarded empty managed-MySQL bootstrap, a non-secret `.env.beta.example`, and a Render web-service blueprint. These are deployment prerequisites, not evidence that a public beta is already live. See [`docs/BETA_DEPLOYMENT.md`](docs/BETA_DEPLOYMENT.md).

## Canonical execution surface

The root `package.json` is the canonical engineering-beta workspace surface:

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm run check:packages
pnpm test
pnpm run build
pnpm db:push
pnpm start
```

`pnpm db:push` is a Drizzle schema/migration command for an intentionally configured database. The guarded local beta path uses `pnpm local:db` instead. Do not run database commands against a shared, staging, or production-like database until its bootstrap/migration plan has been reviewed and recorded.

The canonical application server entry point is `server/_core/index.ts`. The canonical frontend tree is `client/`. Independently testable product/domain libraries live under `packages/`.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — canonical component boundaries and control/data flow.
- [`docs/PLATFORM_KERNEL.md`](docs/PLATFORM_KERNEL.md) — capability dependency graph, runtime diagnostics, request correlation, retry, and circuit-breaker contracts.
- [`docs/RUNTIME_GUARDRAILS.md`](docs/RUNTIME_GUARDRAILS.md) — lifecycle state, liveness/readiness, overload bulkhead, HTTP timeouts, and graceful shutdown.
- [`docs/STARTUP.md`](docs/STARTUP.md) — exact production port binding, listening readiness, startup failure cleanup, and development fallback.
- [`docs/FATAL_RUNTIME.md`](docs/FATAL_RUNTIME.md) — synchronous fatal monitoring, redaction, default crash preservation, and restart boundaries.
- [`docs/SHUTDOWN.md`](docs/SHUTDOWN.md) — coordinated signal ownership, ordered resource drain, MySQL pool close, and timeout semantics.
- [`docs/READINESS.md`](docs/READINESS.md) — shared configuration/database readiness, timeout/cache behavior, and optional dependency degradation.
- [`docs/DATABASE_POOL.md`](docs/DATABASE_POOL.md) — MySQL pool sizing, bounded queue behavior, telemetry, shutdown, and deployment limits.
- [`docs/EVENT_FABRIC.md`](docs/EVENT_FABRIC.md) — versioned events, transactional outbox, idempotency contracts, and delivery boundaries.
- [`docs/OUTBOX_DISPATCHER.md`](docs/OUTBOX_DISPATCHER.md) — database leases, retry/dead-letter behavior, durable consumer receipts, and internal dispatch diagnostics.
- [`docs/DEAD_LETTER_OPERATIONS.md`](docs/DEAD_LETTER_OPERATIONS.md) — admin-only metadata inspection, guarded replay, audit behavior, and recovery limits.
- [`docs/REQUEST_SECURITY.md`](docs/REQUEST_SECURITY.md) — cookie-authenticated mutation origin enforcement and session-cookie transport boundary.
- [`docs/SOCIAL_CONSISTENCY.md`](docs/SOCIAL_CONSISTENCY.md) — database uniqueness, concurrent social mutation behavior, and follow atomicity.
- [`docs/IDEMPOTENT_MUTATIONS.md`](docs/IDEMPOTENT_MUTATIONS.md) — actor-scoped idempotency keys, durable replay, and conflict boundaries.
- [`docs/BROWSER_SECURITY.md`](docs/BROWSER_SECURITY.md) — production CSP/HSTS, browser isolation headers, and analytics privacy boundary.
- [`docs/PRODUCT_CATALOG.md`](docs/PRODUCT_CATALOG.md) — product/domain inventory and integration-status model.
- [`docs/LOCAL_DEVELOPMENT.md`](docs/LOCAL_DEVELOPMENT.md) — reproducible local setup and verification.
- [`docs/BETA_DEPLOYMENT.md`](docs/BETA_DEPLOYMENT.md) — invitation-only deployment, production configuration, managed-database bootstrap, and verification gates.
- [`docs/INTEGRATION_CONTRACTS.md`](docs/INTEGRATION_CONTRACTS.md) — cross-product contracts and fail-closed behavior.
- [`docs/ENGINEERING_BETA_LIMITATIONS.md`](docs/ENGINEERING_BETA_LIMITATIONS.md) — explicit non-production limitations.
- [`docs/CANONICAL_ARCHITECTURE_INVENTORY.md`](docs/CANONICAL_ARCHITECTURE_INVENTORY.md) — evidence-based authoritative-vs-legacy inventory rules.
- [`BETA_SCOPE.md`](BETA_SCOPE.md) — Mission Control invitation-only beta promise, included surfaces, and explicit exclusions.
- [`BETA_RELEASE_CHECKLIST.md`](BETA_RELEASE_CHECKLIST.md) — required evidence for every beta promotion.
- [`catalogs/mission-control-beta.json`](catalogs/mission-control-beta.json) — machine-readable beta capability register and availability labels.
- [`SECURITY.md`](SECURITY.md) — security reporting and current threat boundaries.

Historical audit/readiness documents should be treated as dated evidence snapshots unless they explicitly identify a newer default-branch SHA.

## Development workflow

1. Start from current `main`.
2. Make focused changes on an isolated branch.
3. Run the same verification commands used by CI.
4. Open one focused pull request.
5. Treat exact-head CI as the release evidence for that PR.
6. Do not merge required red, stale, skipped, cancelled, or still-running checks.

See [`docs/LOCAL_DEVELOPMENT.md`](docs/LOCAL_DEVELOPMENT.md) for details.

## Product and integration boundaries

A package, page, branch, or historical product slot is not automatically a production-integrated capability. Product status is described using explicit maturity terms such as:

- **domain core** — deterministic library logic with tests;
- **integration contract** — a defined interface between components;
- **engineering-beta integration** — a tested local/CI path across canonical components;
- **provider-backed capability** — only when an external provider is actually connected and verified.

The current repository is primarily in the first three categories.

## Security

Do not commit secrets or credentials. Report suspected security issues privately as described in [`SECURITY.md`](SECURITY.md). Security-sensitive changes should preserve fail-closed behavior and include targeted tests.

## License

See the repository license metadata and source headers for applicable licensing terms.
