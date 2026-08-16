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

## Security restrictions

Do not provide the actual password, complete connection string, private key, access token, or other secret in chat, repository files, screenshots, fixtures, or logs. The execution environment must receive access through the approved secret-manager or connector mechanism.

## Resume sequence

Once all inputs are available, validate connectivity; verify least-privilege grants; execute the real migration; verify schema and checksum; run bounded connection testing; execute synthetic authorization tests; create and restore an encrypted snapshot; sanitize all artifacts; update the six evidence files; rerun relevant database/security tests; and report `VERIFIED`, `FAILED`, or `BLOCKED` solely from fresh evidence.

**Current blocker:** No approved isolated staging MySQL/TiDB instance and no approved staging `DATABASE_URL` secret-manager reference are available to the execution environment.
