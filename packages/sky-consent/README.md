# SkyConsent — Slot #66 / Lane 06

SkyConsent is an engineering-beta consent/preferences policy library for SKYCOIN4444. It records deterministic consent decisions by purpose and policy version and defaults optional processing to denied when consent is missing or stale.

## Boundaries

- No legal or regulatory compliance certification is claimed.
- No external consent-management provider is connected.
- No identity verification is performed; `subjectId` is a caller-supplied platform identifier.
- Persistence, authentication, authorization, tenant isolation, audit retention, and UI are responsibilities of integrating services.
- `source: "admin"` is descriptive metadata only; this library does not prove that an administrator performed or authorized the write.
- `essential` is an application policy category, not a legal determination.

## SKYCOIN4444 integration contract

Callers provide `ConsentRecord` values from their storage boundary, then call `decideConsent(purpose, currentPolicyVersion, records)` before optional analytics, personalization, marketing, or AI-training workflows. Runtime validation rejects unknown purpose/state/source values, malformed identifiers, and non-canonical timestamps. The function returns a small `ConsentDecision` contract suitable for API or middleware adapters.

`recordedAt` must use canonical UTC ISO-8601 form (`YYYY-MM-DDTHH:mm:ss.sssZ`). The validator round-trips the parsed instant so impossible calendar dates cannot be silently normalized by JavaScript.

## Security notes

Subject IDs and policy versions are allow-list validated. Runtime enum values are fail-closed. Optional purposes fail closed. Callers must still authenticate the subject, authorize consent writes and administrative actions, enforce tenant/resource ownership, protect records at rest, and append audit events where required. A valid `ConsentRecord` is not proof that the caller was authorized to create it.

## Validation

Run from the repository root:

```sh
pnpm exec vitest run packages/sky-consent/src/index.test.ts
pnpm run check:packages
pnpm exec prettier --check packages/sky-consent
pnpm audit --audit-level high
```
