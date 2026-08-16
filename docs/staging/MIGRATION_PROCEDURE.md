# Staging Migration Procedure

**Checkpoint:** `41316ef`  
**Status:** **BLOCKED — procedure prepared, execution requires approved staging access**

## Repository configuration

The schema is located at `drizzle/schema.ts`. The application database module is `server/db.ts`, which uses `drizzle-orm/mysql2` and `mysql2/promise`. Startup requires an explicit `DATABASE_URL` and refuses an implicit or mock database. The repository migration command is:

```text
pnpm run db:push
```

The command expands to `drizzle-kit generate && drizzle-kit migrate`.

## Required environment

The command must run only in an approved isolated staging environment with `DATABASE_URL` supplied through the approved secret manager. The secret value must never be committed, printed, or included in evidence. No production endpoint or production data may be used.

## Execution and verification sequence

1. Confirm the staging resource identifier, database name, isolation, network controls, and production-data exclusion.
2. Confirm the staging-only credential and least-privilege grants through the secret manager.
3. Capture sanitized start and end timestamps.
4. Run `pnpm run db:push` against staging only.
5. Record warnings and errors without suppressing failures.
6. Verify the expected Drizzle schema and migration state using provider metadata or a sanitized schema export.
7. Generate a reproducible checksum of the sanitized schema/state representation.
8. Record the result in `03-migration-transcript.txt`.

## Expected successful result

The migration command exits successfully, the staging schema matches `drizzle/schema.ts` and the generated migration state, and the reproducible schema checksum is recorded. A successful build or local test is not migration evidence.

## Rollback

Before migration, capture an approved staging snapshot. If migration fails or schema verification is inconsistent, preserve the failure output, stop the application test, restore the pre-migration staging snapshot, and document the restoration. Do not suppress or bypass a migration failure.

**Current result:** NOT EXECUTED. No approved staging database or staging `DATABASE_URL` is available.
