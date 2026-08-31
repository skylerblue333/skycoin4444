# Authorization boundary audit

Scope: identify Wave-2 APIs or domain cores that rely on callers for authentication, authorization, tenant isolation, or resource-level access checks.

## Evidence-backed finding: SkyConsent (#66)

`packages/sky-consent` is a provider-neutral domain library, not an authorization service. Its `ConsentRecord.source` field is caller-supplied metadata and must not be interpreted as proof that a user, administrator, or migration process was authenticated or authorized.

The hardening pass now verifies the boundaries that this package can enforce locally:

- runtime `purpose`, `state`, and `source` values are allow-listed and fail closed;
- `subjectId` and `policyVersion` remain allow-list validated;
- `recordedAt` must be canonical UTC ISO-8601 and must round-trip through `Date.toISOString()`, rejecting impossible calendar dates and alternate representations;
- optional purposes remain denied when consent is missing or stale;
- regression tests cover invalid enum-like values and invalid timestamps from untyped callers.

The following remain caller/integration responsibilities and are **not** claimed by this package:

- authenticating the subject or administrator;
- authorizing consent writes or administrative transitions;
- verifying tenant/resource ownership;
- durable storage, record-at-rest protection, or audit retention;
- legal/regulatory consent classification or certification.

## Acceptance status

- inventory caller-enforced authorization boundaries: **verified for SkyConsent**;
- flag paths that could be mistaken for enforcement: **`source: "admin"` explicitly documented as descriptive only**;
- verify fail-closed validation where implemented: **covered by package regression tests**;
- define targeted tests for sensitive transitions: **runtime enum and timestamp boundary tests added**;
- retain truthful engineering-beta limitations: **documented in the package README and this audit**.

This finding is in-repository evidence only. It does not establish production authentication, authorization, tenant isolation, compliance, or deployment.
