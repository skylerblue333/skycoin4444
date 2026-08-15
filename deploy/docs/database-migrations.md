# Database and Migration Runbook

The application uses Drizzle ORM with a MySQL/TiDB-compatible `DATABASE_URL`. The database is server-side only. Never put the connection string in the browser or Git.

## Pre-migration gates

Confirm the target database, owner authorization, current schema version, maintenance/rollback plan, and a successful backup that can be accessed. Never run a destructive reset against production. Confirm the release SHA and inspect generated SQL before applying it.

## Repository procedure

From the reviewed release checkout:

```bash
pnpm install --frozen-lockfile
pnpm drizzle-kit generate
# Read and review the generated SQL under drizzle/migrations/.
```

Apply the reviewed migration through the approved production database mechanism. The repository package deliberately does not auto-run migrations from `deploy.sh`; migration execution requires a separate explicit approval because database rollback compatibility must be assessed first.

The existing package script `pnpm db:push` combines generation and migration behavior and must not be used blindly against production. Prefer an inspected migration artifact and the provider-approved migration command.

## Verification

After migration, verify connection, required tables, read/write behavior for users, products, messages, posts, comments, and notifications, and authentication persistence. Record database host identity without exposing credentials, migration identifiers, timestamp, operator, and test results in the readiness report.

If the database is unavailable, the deployment must fail its readiness gate rather than report a partial production pass.
