# SKYCOIN4444 Platform Family Recovery

**Status:** Discovery baseline, not a maturity claim.  
**Generated:** 2026-08-22 from the live GitHub account inventory.

## Purpose

The portfolio is being recovered as a **platform family**, not expanded by repository count. Each retained repository must have one concrete responsibility, an executable contract, tests, documented setup, and a truthful status. Experiments and duplicate implementations will be labeled, consolidated, or archived after repository-level evidence is collected.

## Current live inventory

The reproducible inventory currently reports **231 repositories**: 194 public, 37 private, zero archived, one fork, and all 231 pushed since 2026-08-01. These are GitHub metadata facts only. They do not prove that a repository builds, tests, deploys, or implements the capability described by its README or description.

The inventory found **104 repositories whose descriptions contain implementation or enterprise-style claim signals**. That number is a review queue, not a count of production systems. Every repository is initially marked `unverified` in `docs/repository-inventory.json` until executable evidence is recorded.

## Proposed family model

| Family area | Candidate responsibility | Evidence required before “working” status |
|---|---|---|
| Core platform | `skycoin4444` owns the integrated product shell and cross-module navigation | Clean install, typecheck, build, smoke tests, and explicit unavailable states for unsupported modules |
| API/backend | `skycoin44-backend` owns server contracts and authentication boundaries | API contract tests, authorization tests, persistence tests, error/status coverage, and deployment evidence |
| Frontend | `skycoin44-frontend` or the selected frontend repository owns the user-facing application | Build, route smoke tests, accessibility checks, and API contract compatibility |
| Wallet/finance | One retained wallet repository owns read-only portfolio and later transaction workflows | Real data-source integration, address validation, idempotency, transaction-state tests, and no fake balances |
| AI | One retained HopeAI repository owns model orchestration and provider boundaries | Provider health checks, request/response schemas, budget/error handling, and integration tests |
| Education | One retained SkySchool repository owns courses, quizzes, and certifications | Persistent course/progress models, authorization tests, and end-to-end learner workflow |
| Shared infrastructure | One observability/reliability repository owns reusable logging, metrics, and health conventions | Example service integration, emitted metrics, CI verification, and documented operational runbook |
| Experiments | All other prototypes remain explicitly experimental until promoted | README status, scope, run instructions, known limitations, and no production-language claims |

These are **candidate ownership assignments**, not final consolidation decisions. The next step is repository content inspection, not mass deletion or automatic archival.

## Acceptance standard

A repository may claim `working` only when its default branch has a reproducible setup, at least one meaningful automated test for its core behavior, a documented contract, and a passing CI workflow. A repository may claim `production` only after deployment evidence, operational checks, security review, and real integration evidence exist. A repository with screens but placeholder handlers remains `scaffold` or `experimental`.

Metrics will be reported from executable evidence: lines of code counted by a fixed command, test counts and pass rates from CI, API coverage from route-to-test mapping, deployment URLs and timestamps, measured latency percentiles, dependency and vulnerability reports, and data-source health. Repository descriptions, commit counts, screen counts, and file counts will never be presented as proof of functionality.

## Immediate work sequence

The first platform slice is the core/API/frontend contract. It will be made buildable and testable before wallet, exchange, mining, NFT, or governance claims are promoted. Duplicate repositories will be compared by actual source, contracts, tests, and deployment value. Where consolidation is justified, the retained repository will receive migration notes and the predecessor will be labeled with its successor rather than silently erased.

This recovery deliberately favors a smaller, credible family over 231 nominally active repositories. The portfolio will grow in capability only when each addition can be independently examined and reproduced.
