# Local Development

## Prerequisites

- Node.js 22, matching repository CI.
- pnpm 11.20.0, matching `packageManager` and CI.
- Git.
- Optional database/provider credentials only for the specific integration you intend to exercise.

Do not copy production secrets into local configuration. Missing external providers should remain explicit unavailable states rather than being replaced by fake success.

## Install

From the repository root:

```bash
pnpm install --frozen-lockfile
```

A frozen install failure is a real configuration problem. Regenerate the lockfile intentionally when dependency policy changes; do not weaken the frozen-lockfile gate to make CI pass.

## Core verification

Run the same core commands protected by CI:

```bash
pnpm run check
pnpm run check:packages
pnpm test
pnpm run build
pnpm audit --prod --audit-level high
```

A release claim should not be based on only one of these commands.

## Development server

```bash
pnpm dev
```

The canonical development entry point is `server/_core/index.ts`.

## Production-style local bundle

```bash
pnpm run build
pnpm start
```

A successful local bundle/start does not establish that DNS, TLS, databases, OAuth, storage, AI, payment, blockchain, monitoring, or other production infrastructure is configured.

## Database schema and migrations

```bash
pnpm db:push
```

This runs Drizzle schema generation and migration. Run it only against a database you intentionally configured and verified. The repository does not treat the existence of this command as evidence of a production database or successful production migration.

## Environment-dependent capabilities

Several application paths depend on external configuration. Expected engineering-beta behavior is to fail explicitly or report unavailable state when a required provider is absent. Do not add fabricated balances, transactions, users, AI responses, chain activity, or provider success merely to make demos appear complete.

## Pull-request workflow

1. Update from current `main`.
2. Use a focused branch.
3. Make the smallest coherent change.
4. Run relevant local checks.
5. Open a focused PR with truthful capability and limitation text.
6. Require exact-head CI success before merge.
7. Re-run CI after every head-changing fix.

Skipped, stale, cancelled, queued, or failing checks are not release evidence.
