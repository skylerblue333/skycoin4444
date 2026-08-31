# Engineering Beta Integration Gate

## Purpose

This evidence note defines the explicit integration-test gate used for Issue #187. It separates the canonical release integration suite from the broader unit/package test command so CI can prove that integration coverage actually ran.

## Enforced command

```sh
pnpm run test:integration
```

The command executes `tests/release/integration-smoke.test.ts` with Vitest. Required CI runs this command after the broader test suite and before the production build.

## Current verified scope

The release integration smoke exercises the SkyEvents -> SkyAudit contract boundary, including deterministic normalization, audit metadata redaction, deterministic replay identity, and rejection of an invalid event instant.

This is contract-level engineering-beta evidence. It does not prove live external identity, payment, ledger, notification, AI-provider, blockchain, persistence, or delivery integrations.

## Fail-closed boundary

The current release test proves that an invalid producer timestamp is rejected rather than normalized into a fabricated successful event. Additional unavailable-provider and security/financial fail-closed cases remain separate Gate C work and must not be inferred from this gate.

## Release rule

Engineering-beta release evidence may count the integration-test quality gate only when the exact release-candidate commit has a successful required CI run containing the dedicated `Engineering-beta integration tests` step. A skipped, cancelled, stale, or earlier-head run does not qualify.
