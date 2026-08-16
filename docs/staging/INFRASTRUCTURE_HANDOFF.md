# Staging Database Infrastructure Handoff

**Checkpoint:** `41316ef`  
**Overall status:** **STAGING DATABASE EVIDENCE: BLOCKED**

## Required inputs from the infrastructure/database owner

| Required input | Required form |
|---|---|
| Approved staging provider/resource ID | Provider resource identifier; no secret values |
| Isolated endpoint | Host and port metadata only; no credentials |
| Database name | Staging database name |
| Secret-manager reference | Reference/path/identifier only; never the secret value |
| Production-data exclusion | Explicit confirmation that production data is excluded |
| Network/access controls | Approved network path, allowlist, security-group, or equivalent evidence |
| Approved staging-only credential process | Secret creation, rotation, grants-review, and revocation process |
| Correct staging connection verification | Host, database, staging-only user, TLS, and production endpoint exclusion |
| Backup/restore evidence | Applicable policy or encrypted snapshot and isolated restore evidence |
| Connection-limit evidence | Provider capacity, application pool usage, bounded test, and recovery |
| Authorization evidence | Least-privilege migration grants and synthetic cross-account tests |
| Migration evidence | Sanitized `pnpm run db:push` transcript, schema verification, and actual checksum |

## Security restrictions

Do not provide the actual password, complete connection string, private key, access token, or other secret in chat, repository files, screenshots, fixtures, or logs. The execution environment must receive access through the approved secret-manager or connector mechanism.

## Resume sequence

Once all inputs are available, verify staging isolation and production-data exclusion; validate connectivity; verify the staging-only credential and least-privilege grants; confirm network controls and TLS; check backup/restore capability; check connection limits; execute synthetic authorization tests; securely inject `DATABASE_URL`; run exactly `pnpm run db:push`; independently verify the resulting schema; generate an actual deterministic schema checksum; sanitize all artifacts; update the six evidence files; rerun relevant database/security tests; and report `VERIFIED`, `FAILED`, or `BLOCKED` solely from fresh evidence. Migration success alone does not close the staging gate.

**Current blocker:** No approved isolated staging MySQL/TiDB instance and no approved staging `DATABASE_URL` secret-manager reference are available to the execution environment.
