# Engineering-Beta Lint Scope

## Enforced command

`pnpm run lint` runs ESLint over canonical engineering-beta code in:

- `server/`
- `packages/`
- `scripts/`

The gate uses TypeScript-aware parsing for TypeScript sources and currently enforces a focused safety profile including debugger/eval/with misuse, constant binary-expression errors, and unsafe non-null assertion on optional chains.

CI runs lint independently from TypeScript checks. A passing typecheck is not treated as a lint pass.

## Current exclusion

The very large `client/` tree is excluded from this first lint profile because it contains substantial historical/generated/demo-oriented surface that has not yet been fully classified as canonical vs legacy. This exclusion is an explicit engineering-beta limitation, not a claim of repository-wide lint cleanliness.

The cleanup/release program should expand lint coverage as client surfaces are promoted to canonical status or safely quarantined.

## Formatting

`pnpm run format:check` is available as a separate deterministic Prettier verification command for release-critical documentation, scripts, and workflow files. Formatting and lint remain distinct checks.

## Release interpretation

A green lint gate means the declared canonical server/domain/script scope passes the configured ESLint safety rules at the exact audited commit. It does not establish that every UI page is lint-clean, that the rule set is exhaustive, or that the repository has passed a formal code-quality/security audit.
