# SkySchool Engineering Beta Journey

## Scope

The first concrete Skycoin4444 beta workflow is the authored SkySchool course journey at `/course-catalog`. It uses the versioned `client/src/data/gapCourses.ts` curriculum, deterministic question grading, authenticated progress reads, and authenticated lesson-completion writes.

This workflow is non-financial. It does not issue credentials, connect wallets, sign transactions, transfer tokens or NFTs, call a blockchain provider, or provide personalized financial advice.

## Implementation evidence

| Boundary | Implementation | Evidence |
| --- | --- | --- |
| Authenticated access | `protectedProcedure` is required for progress reads and writes. | `server/routers/learningProgress.ts` |
| User isolation | Every query filters by `ctx.user.id`. | `server/routers/learningProgress.ts` |
| Idempotency | A composite uniqueness constraint and existing-row check prevent duplicate completion records. | `drizzle/schema.ts`, `drizzle/migrations/0005_course_progress.sql` |
| Deterministic grading | The client enables completion only after the authored answer matches the course key. | `client/src/pages/CourseCatalog.tsx`, `client/src/data/gapCourses.ts` |
| Preview behavior | Unauthenticated visitors can inspect content but cannot persist progress. | `client/src/pages/CourseCatalog.tsx` |
| Safety boundary | No certificate, financial, wallet, custody, token, or chain behavior is exposed by this workflow. | `BETA_SCOPE.md` and page copy |

## Verification record

The implementation was merged to `main` through pull request #232 after the required GitHub CI validation passed. The validation covered TypeScript, package workspace typechecking, lint, credential-pattern scan, beta-marker audit, unit tests, integration tests, production build, and high-severity dependency audit.

The local verification result was **34 test files and 138 tests passed**, with a successful production build and package typecheck.

## Promotion gate

This record supports an **engineering beta** status. Promotion to `available_in_beta` still requires deployment of the migration and service, release-environment smoke testing of sign-in and progress persistence, accessibility verification, an identified content owner, a monitored support route, and a rollback owner. Until those checks are recorded, the catalog must not claim that the journey is independently deployed and verified.
