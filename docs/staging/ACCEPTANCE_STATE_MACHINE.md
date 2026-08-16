# Staging Acceptance State Machine

**Checkpoint:** `41316ef`  
**Assessment date:** 2026-08-16  
**Current state:** **BLOCKED**

Every claim requires fresh evidence from a provider record, sanitized configuration export, command result, or test result. Anything without evidence remains **BLOCKED / NOT VERIFIED**.

## State transitions

```text
BLOCKED
  │ infrastructure supplied
  ▼
INFRASTRUCTURE EVIDENCE RECEIVED
  │ all evidence independently verified
  ▼
EVIDENCE VERIFIED
  │ exact command executed against verified staging
  ▼
MIGRATION EXECUTED
  │ actual database inspected
  ▼
SCHEMA VERIFIED
  │ deterministic checksum generated
  ▼
CHECKSUM VERIFIED
  │ all remaining acceptance criteria pass
  ▼
FINAL STAGING GATE
```

## Phase A — Infrastructure owner

The infrastructure/database owner must supply evidence for the approved staging provider/resource ID, isolated host and port, staging database name, secret-manager reference, production-data exclusion, network/access controls, staging-only credential lifecycle, correct staging connection verification, backup/restore capability, connection-limit capacity, and authorization/least-privilege controls.

Migration evidence is a Phase B output: it cannot be accepted until the release operator executes the exact repository command against the independently verified staging target and verifies the resulting schema and checksum.

## Phase B — Application/release operator

After Phase A evidence is accepted, the operator securely retrieves the staging secret, verifies host/database/user/TLS and production-endpoint exclusion, verifies grants, runs security and authorization tests, performs bounded connection testing, executes `pnpm run db:push`, inspects the actual staging schema, generates a deterministic checksum from the actual schema state, sanitizes artifacts, updates `03-migration-transcript.txt`, and reruns relevant database/security tests.

## Current blocker

The transition from **BLOCKED** to **INFRASTRUCTURE EVIDENCE RECEIVED** cannot occur because no approved isolated MySQL/TiDB resource, resource metadata, or approved secret-manager-based staging connection mechanism has been supplied to the execution environment.

No migration command was run. No provider, endpoint, credential, schema checksum, connection result, authorization result, or backup/restore result was invented.
