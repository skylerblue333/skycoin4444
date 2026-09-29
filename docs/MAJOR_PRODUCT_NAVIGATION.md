# Major Product Navigation Contract

This document defines the launch-hardening navigation contract for the SKYCOIN4444 V5 invitation-only engineering beta.

## Why this exists

The repository contains a large historical route catalog. Testers should not have to know route names or search hundreds of screens to reach the highest-value product areas. The global shell therefore promotes a small set of stable entry points while the full route explorer remains available for long-tail discovery.

This hardening pass intentionally does not replace or duplicate active feature work in HopeAI, Social, Gaming, SkySchool, or SkyHope. It connects the current canonical surfaces and adds regression coverage around their discoverability.

## Major connected paths

| Area | Canonical entry | Beta boundary |
| --- | --- | --- |
| HopeAI | `/hope-a-i` | Controlled beta. Provider-backed AI, autonomous external actions, and durable cross-device memory require separate evidence. |
| Social | `/activity-feed` | Core beta surface using account-aware/persisted records where implemented. No claim of production-scale audience or moderation coverage. |
| Gaming | `/gaming` | Core playable beta. No real-money wagering, payout, custody, or blockchain execution is implied. |
| SkySchool | `/sky-school` | Core beta learning surface. Completion evidence does not imply accreditation or verified mastery. |
| SkyHope | `/charity` | Controlled impact surface. Donation settlement and external impact verification remain gated until separately proven. |

## Navigation requirements

1. Global desktop and mobile navigation must make the major product loop discoverable without direct URL knowledge.
2. The voice-navigation prompt must mention School, HopeAI, and SkyHope in addition to the existing social/gaming paths.
3. The home launchpad must expose SkyHope as a direct action.
4. The durable beta journey must preserve its five persisted activation gates and may offer post-activation links into HopeAI, Social, Gaming, SkySchool, and SkyHope.
5. All promoted paths must exist in the generated route catalog.
6. Product-facing route classification must continue to resolve each promoted path to its intended beta experience area.
7. Status labels remain evidence boundaries, not claims of production certification.

## Verification

`tests/release/v5-major-product-navigation.test.ts` locks the critical route registrations, area mappings, global-navigation promotion, SkyHope launchpad visibility, and the post-activation connected-product journey.

The normal repository gates remain authoritative: typecheck, package checks, lint, tests, integration tests, production build, security/release workflows, and exact-head CI for the canonical pull request.
