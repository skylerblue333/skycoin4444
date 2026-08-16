# Admin Authorization Evidence

**Assessment checkpoint:** `41316ef`  
**Code checkpoint under test:** `486db38`
**Status:** **PARTIALLY VERIFIED**

## Automated evidence

Command executed with the repository’s existing test-only `DATABASE_URL` injection:

```text
DATABASE_URL=mysql://test:test@127.0.0.1:3306/skycoin_test pnpm exec vitest run server/admin.authorization.test.ts
```

The test-only URL was used only to satisfy the application’s explicit startup guard. The tests exercised router authorization boundaries and did not establish a database connection or staging evidence.

| Test | Result |
|---|---|
| Authenticated non-admin denied from `admin.stats` | PASS |
| Admin reaches `admin.stats` unavailable boundary | PASS |
| Non-admin denied from `admin.users` and `admin.moderationQueue` | PASS |
| Non-admin denied from `admin.updateUserRole` | PASS |
| Unauthenticated denied from `admin.updateUserRole` | PASS (`UNAUTHORIZED`) |
| Invalid role mutation input rejected | PASS (`BAD_REQUEST`) |
| Admin reaches listings and role-mutation unavailable boundary | PASS; mutation remains truthfully unavailable, not fake success |

**Suite result:** 7 tests passed.
**Strict TypeScript check:** PASS (`pnpm run check`).
**Production build:** PASS (`pnpm run build`).
**Remote CI:** PASS — run `31951455311` for commit `486db382a27a28b15506b2f6c4989c89e77d0671`.

## Remaining evidence gaps

The router-level authorization behavior is verified for the covered procedures. The middleware now distinguishes unauthenticated requests (`UNAUTHORIZED`) from authenticated non-admin requests (`FORBIDDEN`).

### Audit logging

The schema contains a `moderation_logs` table, but repository inspection found no server-side write from `admin.updateUserRole` or another administrative mutation into an audit event store. The `auditLogs` router is a generic unavailable/empty feature boundary rather than persistence evidence. Therefore:

| Audit requirement | Status |
|---|---|
| Actor identity recorded | NOT VERIFIED |
| Action recorded | NOT VERIFIED |
| Target/resource recorded | NOT VERIFIED |
| Timestamp recorded | Schema field exists; behavior NOT VERIFIED |
| Outcome recorded | NOT VERIFIED |
| Denied attempt handled in audit log | NOT VERIFIED |
| Sensitive-data redaction test | NOT VERIFIED |

### Browser/session authorization

No Playwright, Cypress, or browser end-to-end harness is present in the repository, and no approved staging identity provider is available. Browser/session authorization, secure cookie behavior, logout invalidation, and identity-provider behavior therefore remain **NOT VERIFIED**. Router tests are not browser evidence.

### Staging authorization

Staging database authorization remains **BLOCKED** pending approved staging infrastructure, least-privilege grants, and synthetic cross-account tests.

## Rollback plan

If a later authorization regression appears, revert the authorization middleware/router change, disable the admin surface, and rerun the denial and allow tests before re-enabling it.

## Acceptance

**Partial acceptance only.** The automated router boundary is verified; the overall admin authorization workstream remains **PARTIALLY COMPLETE** until an actual audit-event implementation/test and browser/session evidence are supplied. Staging authorization is a separate blocked gate.
