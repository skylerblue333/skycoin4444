# SkyConsent — Slot #66 / Lane 06

SkyConsent is an engineering-beta consent/preferences policy library for SKYCOIN4444. It records deterministic consent decisions by purpose and policy version and defaults optional processing to denied when consent is missing or stale.

## Boundaries

- No legal or regulatory compliance certification is claimed.
- No external consent-management provider is connected.
- No identity verification is performed; `subjectId` is a caller-supplied platform identifier.
- Persistence, authentication, audit retention, and UI are responsibilities of integrating services.
- `essential` is an application policy category, not a legal determination.

## SKYCOIN4444 integration contract

Callers provide validated `ConsentRecord` values from their storage boundary, then call `decideConsent(purpose, currentPolicyVersion, records)` before optional analytics, personalization, marketing, or AI-training workflows. The function returns a small `ConsentDecision` contract suitable for API or middleware adapters.

## Security notes

Subject IDs and policy versions are allow-list validated. Invalid timestamps are rejected. Optional purposes fail closed. Callers must still authenticate the subject, authorize writes, protect records at rest, and append audit events where required.

## Validation

Run from the repository root:

```sh
pnpm exec vitest run packages/sky-consent/src/index.test.ts
pnpm run check:packages
pnpm exec prettier --check packages/sky-consent
pnpm audit --audit-level high
```
