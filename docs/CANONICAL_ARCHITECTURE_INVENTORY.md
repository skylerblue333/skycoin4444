# SKYCOIN4444 Canonical Architecture Inventory

**Tracking:** #187, #189  
**Inventory baseline:** `main` at `9316f02eb8347fe9eff954f5979c79747a07d0a2`

## Purpose

This document identifies the current authoritative engineering surfaces before cleanup or deletion. It is an inventory, not a production-readiness certification.

## Canonical repository layers

### 1. Application workspace

The root `package.json` defines a pnpm workspace over `packages/*` and the canonical application commands:

- `pnpm dev` -> `server/_core/index.ts`
- `pnpm build` -> Vite client build plus bundled server entry
- `pnpm start` -> `dist/index.js`
- `pnpm check` -> TypeScript no-emit validation
- `pnpm test` -> Vitest
- `pnpm check:packages` -> package-level TypeScript validation
- `pnpm db:push` -> `drizzle-kit generate && drizzle-kit migrate`, the canonical schema/migration entry point

These commands are the authoritative engineering-beta execution surface unless a later release PR intentionally changes them. Because database schema and migration paths are high-risk release surfaces, `db:push` must remain part of cleanup and release planning even when no live database is connected.

### 2. Server runtime

`server/_core/index.ts` is the canonical server entry point used by both development and production build scripts.

The current server tree separates:

- `server/_core/*` for application/runtime infrastructure such as context, environment access, OAuth/session support, LLM/provider helpers, notification, storage proxying, SDK helpers, and system routing;
- `server/routers.ts` and `server/routers/*` for tRPC/API composition;
- `server/features/*` for feature implementations;
- `server/db.ts` for database integration;
- `server/storage.ts` for storage-facing logic;
- server contract/auth tests including `api-contracts.test.ts` and `auth.logout.test.ts`.

This layer is authoritative for the executable application server. Package domain cores must not be mistaken for automatically wired HTTP/runtime capabilities unless a server integration imports and uses them.

### 3. Product/domain workspace packages

`packages/*` is the canonical home for independently testable domain cores, registries, validators, planners, adapters, and reusable product contracts. Current examples include area/contracts foundations, HopeAI packages, and many `sky-*` product packages such as audit, accounting, cache, catalog, checkout, CDN policy, and capability compatibility.

Package existence proves a code artifact exists; it does not by itself prove UI integration, server exposure, persistence, provider connectivity, production security, or end-to-end readiness.

### 4. Cross-product integration layer

The first verified canonical cross-product vertical was merged through PR #186. Its intended control path is:

`SkyIdentity -> SkyAuth -> SkyMFA -> SkyPermissions -> course adapter -> SkyCredentials -> SkyPayments planning -> ledger adapter -> notification adapter -> SkyAudit`

The course, ledger, and notification boundaries are deliberately narrow adapters where full canonical runtime APIs are not yet independently established. These boundaries must remain fail-closed for authentication, identity-subject, MFA, and authorization failures.

### 5. Client/UI layer

`client/` is the canonical application frontend tree. The repository contains a very broad page surface, including historical/generated/demo-oriented pages. A page file is not sufficient evidence of a completed product workflow. UI surfaces should be promoted to canonical engineering-beta status only when their backing contracts and failure behavior are verified.

### 6. Documentation and evidence

`docs/` is the canonical documentation root. Existing subtrees include architecture, audits, integration, migration, products, Wave-2, and post-Wave-2 evidence, plus repository inventory data.

Historical audits are evidence snapshots. They should retain their original date/scope and must not silently override newer exact-head CI or default-branch evidence.

## Authoritative vs legacy classification rules

A surface is **authoritative** when one or more of the following is true and no newer replacement is established:

1. It is referenced by root build/dev/test/typecheck scripts.
2. It is imported by the canonical server/client runtime.
3. It is a verified package/domain core with tests and documented boundaries.
4. It is part of a merged, exact-head-CI-green integration path.
5. It is current release/control documentation explicitly based on default-branch evidence.

A surface is **legacy/stale candidate** when evidence shows that it:

- documents an older repository state but reads like current status;
- duplicates an implementation that has a clearly established canonical replacement;
- is unreachable from canonical runtime/test/package exports;
- reports fake external success or demo behavior as real behavior;
- is generated/dead content with no tested integration path.

A surface must not be deleted solely because it looks old, large, generated, or duplicated. Cleanup requires replacement evidence and a safe removal path.

## Risk classification for cleanup

### High risk

Do not remove or rewrite without targeted tests and integration evidence:

- authentication/session/MFA/permission boundaries;
- financial/payment/ledger/accounting/treasury code;
- custody/blockchain/Web3 transaction-facing code;
- privacy/secrets/audit/policy code;
- persistence and migration paths;
- release/CI/security configuration.

### Medium risk

Require import/reachability and test review before consolidation:

- server routers/features;
- shared contracts;
- SDK/integration adapters;
- notification/storage/AI-provider helpers;
- canonical client flows.

### Lower risk

May be candidates for quarantine after evidence review:

- stale generated pages;
- redundant historical readiness summaries;
- unused demo/example artifacts;
- duplicate documentation with a clearly newer canonical source.

## Confirmed current quality boundaries

At this inventory baseline, root CI is executable rather than a placeholder and includes locked install, TypeScript validation, tests, production build, and high-severity production dependency audit. The first engineering-beta baseline PR (#188) passed exact-head CI before merge.

This does not imply every package or UI page is integrated or production ready.

## Next inventory work

1. Search placeholder/TODO/mock/demo markers and classify by runtime reachability and risk.
2. Identify duplicate/stale readiness documentation that could misrepresent current status.
3. Map the strongest current product/domain packages to actual server/client integration points.
4. Add the final authoritative architecture document only after this inventory is reconciled.
5. Delete or quarantine artifacts only in focused PRs with explicit evidence and green CI.
