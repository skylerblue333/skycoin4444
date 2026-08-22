# SKYCOIN4444 Repository Audit and Monorepo Foundation

**Date:** 2026-08-22  
**Scope:** Existing repository inventory, primary application baseline, 30-area boundary, and first additive migration checkpoint.

## Executive summary

The repository portfolio contains one large, real TypeScript/React application (`skycoin4444`), a second large ecosystem implementation (`SKYCOIN4444-Ecosystem`), a full-stack platform implementation (`skycoin4444-platform`), an Express API repository, and many smaller or README-only repositories. The safe strategy is to preserve the large applications as source-of-truth candidates, add a canonical monorepo layer incrementally, and populate area repositories only with bounded code whose behavior is deterministic and externally verifiable.

The first checkpoint is complete. The canonical `skycoin4444` repository now contains `@skycoin/contracts` and `@skycoin/area-registry`, a strict TypeScript package configuration, a 30-area manifest, and documented migration boundaries. Ten confirmed README-only area repositories now contain domain-specific typed foundations and have been pushed to their `master` branches.

## Repository evidence

| Repository | Observed condition | Engineering implication |
|---|---|---|
| `skycoin4444` | Real TypeScript/React full-stack application with client, server, shared code, database migrations, docs, data room, and CI | Preserve as the primary application asset; migrate incrementally |
| `SKYCOIN4444-Ecosystem` | Real TypeScript/React full-stack application with additional modules, middleware, deployment material, and research | Treat as a source candidate; do not merge blindly |
| `skycoin4444-platform` | Real full-stack TypeScript application with database and tests | Compare contracts and consolidate only after API review |
| `TS-Express-API` | Real TypeScript API repository | Evaluate as a separate service boundary after route-contract comparison |
| `skycoin4444-core`, `-finance`, `-hopeai`, `-infrastructure`, `-market`, `-security`, `-skychain`, `-skyschool`, `-social`, `-wallet` | README-only at audit time | Populated with small, typed, non-fabricating domain foundations |
| `frontendpages`, `frontenedpages` | Very large real frontend repositories | Require duplicate-code and asset review before any migration |
| `skycoin-production` | Real repository according to supplied inventory | Requires source inspection and dependency classification before adoption |

## Baseline validation

The baseline exposed existing failures before the migration. `skycoin4444` installed successfully and its existing test command completed, but the existing typecheck and production build failed. The build output included unresolved imports such as `client/src/hooks/useAuth`, `client/src/components/StatCard`, `client/src/components/EmptyState`, and `client/src/components/PageSkeleton`. `SKYCOIN4444-Ecosystem` and `skycoin4444-platform` also returned non-zero results during the baseline checks; the platform test run was stopped after it stalled, so its result is not represented as a passing or failing certification.

The new package layer is independently validated. All ten populated area repositories passed strict TypeScript compilation using the canonical repository’s TypeScript toolchain. The canonical monorepo package check also passes.

## Canonical 30-area roadmap

| # | Area | Current status | Boundary |
|---:|---|---|---|
| 1 | Core Platform | Implemented | Application shell and shared coordination |
| 2 | Identity and Authentication | Integrating | Auth contracts, sessions, authorization |
| 3 | Profiles | Implemented | User profile data and presentation |
| 4 | Settings | Implemented | User preferences and account settings |
| 5 | Notifications | Implemented | Notification delivery and state |
| 6 | Admin Controls | Integrating | Privileged operations and auditability |
| 7 | Wallet | Integrating | Watch-only and external signer boundaries |
| 8 | Portfolio Management | Implemented | Portfolio views over supplied data |
| 9 | Live Market Data | Blocked | Requires verified live provider |
| 10 | Exchange | Blocked | Requires real order and settlement integration |
| 11 | NFT Gallery | Integrating | Ownership data must be chain-verified |
| 12 | Mining | Blocked | Requires real device/job evidence |
| 13 | Skychain Protocol | Integrating | Explicit transaction state machine |
| 14 | Cross-chain Bridge | Blocked | Requires audited bridge integration |
| 15 | HopeAI | Integrating | Provider capability and availability states |
| 16 | ShadowChat | Integrating | Messaging contracts and secure transport |
| 17 | AI Control Center | Integrating | Policy, controls, and observability |
| 18 | AI Marketplace | Planned | Listing, entitlement, and provider contracts |
| 19 | SkySchool | Integrating | Courses, lessons, and progress |
| 20 | Courses and Curriculum | Implemented | Existing course content contracts |
| 21 | Quizzes | Implemented | Existing quiz flows and validation |
| 22 | Certifications | Planned | Credential issuance and verification |
| 23 | Community | Planned | Community entities and moderation |
| 24 | Social Graph | Planned | Relationships and privacy controls |
| 25 | Creator Tools | Planned | Content workflows and permissions |
| 26 | Digital Marketplace | Integrating | Listings and order contracts |
| 27 | Payments | Blocked | Requires verified payment processor |
| 28 | Analytics | Planned | Event schema and privacy-safe aggregation |
| 29 | Security and Compliance | Integrating | Redaction, audit, and controls |
| 30 | Observability | Planned | Structured logs, metrics, and traces |

## Non-fabrication controls

Financial, wallet, blockchain, market, mining, and AI modules expose explicit availability or state semantics. A missing external integration is represented as unavailable, blocked, or test mode; the new code does not create balances, prices, transaction success, ownership, mining rewards, or provider responses. Wallet signing and custody remain outside these packages unless a secure external signer is explicitly integrated.

## Git checkpoints

| Repository | Commit | Branch |
|---|---|---|
| `skycoin4444` | `942e00f`, `9c1d7ea`, `ec8716d`, `754523a`, `55aa16e` | `main` |
| Ten area repositories | Individual `feat: add typed ... domain foundation` commits | `master` |

## Next engineering sequence

The next pass should repair the primary application’s unresolved imports and establish a clean baseline before moving client pages or database migrations. After that, each area should receive an adapter-level integration review, API contract tests, authorization checks, and CI coverage. README-only repositories should not be marked production-ready merely because a package exists; status must advance only when integration evidence and tests support it.
