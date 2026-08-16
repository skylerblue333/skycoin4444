# SKYCOIN4444 Infrastructure Owner Evidence Request

**Checkpoint:** `41316ef`  
**Current state:** **BLOCKED — INFRASTRUCTURE EVIDENCE REQUIRED**

Please return metadata and evidence only. Do **not** send passwords, complete connection strings, private keys, access tokens, or other secret values. The application/release operator will retrieve `DATABASE_URL` through the approved secret-manager or connector mechanism only after this evidence package is reviewed and accepted.

| # | Evidence item | Required evidence |
|---:|---|---|
| 1 | Staging resource | Provider and unique resource ID |
| 2 | Endpoint | Staging host and port; no credentials |
| 3 | Database | Staging database name |
| 4 | Secret manager | Secret reference/path only |
| 5 | Data isolation | Explicit confirmation that production data is excluded and production was not connected |
| 6 | Network | Allowlist, security group, private path, TLS requirement, or equivalent access-control evidence |
| 7 | Credential process | Staging-only credential creation, rotation, grants review, and revocation process |
| 8 | Connection verification | Verified staging host, database, staging-only user, TLS, and production-endpoint exclusion |
| 9 | Backup/restore | Applicable policy, or encrypted backup and isolated restore evidence |
| 10 | Connections | Provider capacity, application pool configuration, bounded test, timeouts, and recovery evidence |
| 11 | Authorization | Least-privilege grants and synthetic authorization test evidence |
| 12 | Migration | **Phase B release-operator deliverable; not an infrastructure-owner deliverable** |

## Acceptance requirements

Each item must be traceable to a provider record, sanitized configuration export, command result, or test result. Statements such as “it should work” are insufficient. Production `DATABASE_URL`, production credentials, mock/SQLite databases, fabricated endpoints, unapproved public databases, complete credential-bearing connection strings, and migration runs against unverified databases are not acceptable substitutes.

## Phase separation

**Phase A — Infrastructure owner:** provision the isolated staging resource and supply only items **1–11**: provider/resource, endpoint, database name, secret-manager reference, data isolation, network/TLS, credential lifecycle, connection verification, backup/restore, connection capacity, and authorization/least-privilege evidence. Phase A must transition from `BLOCKED` to `INFRASTRUCTURE EVIDENCE RECEIVED` and then `EVIDENCE VERIFIED` only after independent review.

**Phase B — Application/release operator:** only after Phase A is verified, securely retrieve the staging secret, reverify the target, run the required authorization and bounded connection checks, execute exactly `pnpm run db:push`, independently verify the resulting schema, generate the actual checksum, sanitize `03-migration-transcript.txt`, and rerun relevant database/security tests. Migration evidence is item **12** and is not an infrastructure-owner deliverable.

## Valid state transitions

`BLOCKED → INFRASTRUCTURE EVIDENCE RECEIVED → EVIDENCE VERIFIED → MIGRATION EXECUTED → SCHEMA VERIFIED → CHECKSUM VERIFIED → FINAL STAGING GATE → OWNER ACCEPTANCE`

The current state remains **BLOCKED** because no approved staging resource, endpoint, database name, or secret-manager reference has been supplied. The infrastructure owner must return actual metadata/evidence for items 1–11; no item may be populated with guesses.
