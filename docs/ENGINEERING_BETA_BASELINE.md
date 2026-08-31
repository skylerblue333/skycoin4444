# SKYCOIN4444 Engineering Beta Baseline

**Control issue:** #187  
**Baseline main SHA:** `127a7b691a9574d085aa3ce4e37c422140e1b8e5`  
**Status:** Engineering-beta hardening in progress

## Purpose

This document establishes the authoritative starting point for converting SKYCOIN4444 into a cleaned, documented, integrated engineering-beta platform. Historical audits remain useful evidence, but their old build/test/CI results are snapshots and must not be presented as the current repository state without re-verification.

## Verified current baseline

At the baseline SHA, the repository has a real CI workflow that installs locked dependencies, runs TypeScript checking, executes tests, builds the production bundle, and performs a high-severity production dependency audit.

The immediately preceding integration PR (#186) connected an initial fail-closed platform vertical:

`SkyIdentity -> SkyAuth -> SkyMFA -> SkyPermissions -> course adapter -> SkyCredentials -> SkyPayments planning -> ledger adapter -> notification adapter -> SkyAudit`

PR #186 exact head `f6988ab5f60f49a47ab373ec9f01188e748645f7` passed both the repository CI and the dedicated Platform Vertical CI before merge.

## Canonical maturity language

Until Issue #187 is complete, describe the repository as an **engineering-beta platform under integration and hardening**.

Do not describe repository modules as proof of:

- production deployment or high availability;
- live payment settlement or banking execution;
- blockchain transaction execution or custody;
- regulatory approval or compliance certification;
- production identity/KYC verification;
- external provider connectivity unless independently configured and verified;
- durable persistence for modules that expose only contracts, planners, registries, validators, or in-memory domain cores;
- audited security guarantees.

## Historical audit reconciliation

`docs/REPOSITORY_AUDIT.md` is explicitly an August 22 snapshot of an earlier working copy. Its observations about placeholder CI, failing typecheck/build, and minimal tests describe that audited snapshot, not automatically the current `main` branch. The engineering-beta program must preserve the useful risk findings while replacing stale status claims with exact-head evidence.

Historical risk findings that remain valid until independently closed include:

1. Large generated/placeholder-heavy UI surface should not be equated with completed workflows.
2. Financial, custody, blockchain, administrative, and privacy-sensitive capabilities require explicit authorization, validation, failure behavior, and tests before production use.
3. Secrets and provider credentials must remain server-side and be validated through documented configuration boundaries.
4. Generic or planning-only APIs must not report fake external success.
5. Product count is not a substitute for integrated behavior.

## Gate A classification

### Preserve

- Current executable CI gates.
- Verified product/domain cores and their tests.
- The #186 fail-closed integration vertical.
- Existing architecture, integration, product, migration, Wave-2, audit, and data-room evidence that remains accurate.

### Consolidate

- Overlapping readiness/audit documents into a current engineering-beta release narrative.
- Product documentation into an authoritative catalog distinguishing domain cores, adapters, planners, registries, validators, and externally connected runtimes.
- Architecture documentation around canonical entry points and explicit adapter boundaries.

### Quarantine or remove only with evidence

- Dead generated artifacts.
- Duplicate implementations with a clearly established canonical replacement.
- Stale documentation that could be mistaken for current status.
- Fake-success/no-op runtime behavior.

No code or documentation should be deleted merely to reduce file count.

## Required release evidence

Issue #187 can close only after the release candidate has exact-head evidence for the required repository gates and default-branch containment. The final release record must identify:

- release candidate SHA;
- required CI workflow/run results;
- build/typecheck/test status;
- canonical architecture and product catalog;
- integration coverage and failure-path behavior;
- external dependencies and unavailable capabilities;
- security and persistence boundaries;
- remaining accepted beta limitations.

## Immediate next work

1. Inventory the current canonical architecture and documentation rather than relying on the August 22 snapshot.
2. Classify placeholder/demo/mock/TODO surfaces by risk and runtime reachability.
3. Consolidate the root README and engineering-beta documentation around verified current behavior.
4. Extend integration tests beyond the first platform vertical without inventing external provider success.
5. Record exact-head CI evidence for every release-hardening PR.
