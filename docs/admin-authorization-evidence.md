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

The router-level authorization behavior is verified for the covered procedures. The middleware now distinguishes unauthenticated requests (`UNAUTHORIZED`) from authenticated non-admin requests (`FORBIDDEN`). This does not yet prove browser/session behavior, audit-log persistence, production identity-provider behavior, or staging database authorization. Those remain **NOT VERIFIED** and require their respective approved environments and evidence.

## Rollback plan

If a later authorization regression appears, revert the authorization middleware/router change, disable the admin surface, and rerun the denial and allow tests before re-enabling it.

## Acceptance

**Partial acceptance only.** The automated router boundary is verified; the overall admin authorization workstream remains **PARTIALLY COMPLETE** until browser evidence, mutation audit logging, and environment-backed verification are supplied.
