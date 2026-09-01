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

This evidence does **not** establish production deployment, live banking or payment settlement, custody, blockchain execution, regulatory/compliance approval, external identity verification, live AI-provider connectivity, durable production persistence, TLS/DNS readiness, backup/restore readiness, or audited security.

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

`pnpm db:push` is the schema/migration command. Do not run it against a database you have not intentionally configured and verified.

The canonical application server entry point is `server/_core/index.ts`. The canonical frontend tree is `client/`. Independently testable product/domain libraries live under `packages/`.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — canonical component boundaries and control/data flow.
- [`docs/PRODUCT_CATALOG.md`](docs/PRODUCT_CATALOG.md) — product/domain inventory and integration-status model.
- [`docs/LOCAL_DEVELOPMENT.md`](docs/LOCAL_DEVELOPMENT.md) — reproducible local setup and verification.
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
