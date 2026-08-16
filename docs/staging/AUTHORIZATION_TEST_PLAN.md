# Staging Authorization Test Plan

**Checkpoint:** `41316ef`  
**Status:** **BLOCKED — procedure prepared, execution requires approved staging access**

Use dedicated synthetic staging identities and synthetic records only. Never use production users or production data.

| Test | Expected result | Actual result |
|---|---|---|
| Authorized account reads its own resource | PASS / allowed | NOT EXECUTED |
| Authorized account mutates its own resource | PASS / allowed when supported | NOT EXECUTED |
| Account reads another account's resource | DENY | NOT EXECUTED |
| Account mutates another account's resource | DENY | NOT EXECUTED |
| Invalid or nonexistent resource access | DENY or safe not-found response | NOT EXECUTED |
| Unauthorized administrative mutation | DENY / `FORBIDDEN` | NOT EXECUTED |
| Admin performs authorized administrative operation | PASS / allowed | NOT EXECUTED |
| Wallet ledger read is scoped to `ctx.user.id` | PASS for own records only | NOT EXECUTED |
| Wallet ledger cross-account read | DENY | NOT EXECUTED |

## Execution requirements

Create two ordinary synthetic accounts and one synthetic admin account. Create synthetic records owned by each ordinary account. Capture sanitized request identifiers, procedure names, HTTP/tRPC status, and result classification. Do not record tokens, cookies, passwords, or personally identifying data.

An unexpected authorization success is a security blocker. Preserve the failure evidence and stop acceptance until the underlying access-control defect is corrected and retested.

**Current result:** NOT EXECUTED. No approved staging database, synthetic staging identities, or staging records are available.
