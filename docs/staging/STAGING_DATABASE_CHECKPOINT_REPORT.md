# SKYCOIN4444 Staging Database Checkpoint Report

**Checkpoint:** `41316ef`  
**Assessment date:** 2026-08-16  
**Overall status:** **STAGING DATABASE EVIDENCE: BLOCKED**

> No approved isolated staging MySQL/TiDB instance and staging `DATABASE_URL`/secret-manager reference are available to the execution environment.

| Evidence area | Status | Artifact |
|---|---|---|
| Staging resource | **BLOCKED / NOT VERIFIED** | `01-staging-resource.md` |
| Least-privilege credentials | **BLOCKED / NOT VERIFIED** | `02-staging-credentials.md` |
| Migration and schema checksum | **BLOCKED / NOT VERIFIED** | `03-migration-transcript.txt`; Phase B only after Phase A evidence is independently verified |
| Connection limits | **BLOCKED / NOT VERIFIED** | `04-connection-test.md` |
| Authorization tests | **BLOCKED / NOT VERIFIED** | `05-authorization-tests.md` |
| Backup and restore | **BLOCKED / NOT VERIFIED** | `06-backup-restore.md` |

## Phase A — infrastructure-owner evidence

The infrastructure/database owner must provide actual evidence for the approved isolated staging provider/resource ID, host and port, staging database name, secret-manager reference, production-data exclusion, network/access controls and TLS, staging-only credential lifecycle, correct staging connection verification, backup/restore capability, connection capacity and bounded recovery test, and least-privilege grants with an unauthorized-operation result. Metadata and evidence only are required; secret values must never be sent.

## Phase B — application/release-operator evidence

Only after Phase A evidence is independently verified may the release operator retrieve the staging secret through the approved mechanism, reverify the target, run authorization and bounded connection tests, execute `pnpm run db:push`, inspect the actual schema, generate the actual deterministic checksum, sanitize `03-migration-transcript.txt`, and rerun relevant database/security tests.

## Required execution sequence after access is provided

Complete Phase A evidence and independently verify every prerequisite; then complete Phase B by securely retrieving the staging secret, verifying host/database/user/TLS and production exclusion, verifying grants, running bounded connection and synthetic authorization tests, executing the real Drizzle migration command, independently verifying the schema, generating a reproducible checksum from actual staging state, creating and restoring an encrypted snapshot, capturing sanitized transcripts, cleaning up the temporary target, and obtaining explicit owner acceptance.

## Rollback actions

No database, credential, schema, connection setting, snapshot, or recovery target was changed at this checkpoint. Once execution begins, rollback must use the pre-migration snapshot, credential revocation, restoration of original connection settings, and deletion of the temporary recovery target after verification.

## Release decision

The staging database gate remains **NOT VERIFIED / NOT ACCEPTED**. The master GA decision remains **GA NOT YET AUTHORIZED**.
