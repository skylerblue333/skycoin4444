# SkyFeatureFlags — Wave 2 Slot #153

SkyFeatureFlags is an **engineering-beta deterministic feature-flag library** for local default values, subject-specific overrides, validation, and stable per-subject snapshots.

## Truth boundary
This package is not a hosted feature-flag service, remote configuration provider, experimentation platform, rollout scheduler, analytics system, or production enforcement layer. It performs local deterministic evaluation only.

## Security and validation
Flag keys and subject IDs are constrained to safe identifier characters, numeric values must be finite, string values are bounded, duplicate keys are rejected, and snapshot size is capped. No secrets, persistence, or network calls are used.

## Integration
`createFlagSnapshot` emits `skyfeatureflags.snapshot.v1`, which can be consumed by SKYCOIN4444 services or clients after their own authorization/configuration layer supplies the flags and subject context.

## Validation
```sh
pnpm run check:packages
pnpm vitest run packages/sky-feature-flags/src/index.test.ts
```
