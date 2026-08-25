# SkyEvaluation — Wave 2 Slot #99

SkyEvaluation is an **engineering-beta deterministic evaluation harness** for local model/output comparisons. It supports bounded test suites, weighted exact-match scoring, duplicate-case rejection, and a stable `skyevaluation.v1` integration report.

## Truth boundary
This package does not call AI providers, judge semantic quality, benchmark live models, or claim scientific validity. `exactMatch` is intentionally simple and deterministic; more advanced evaluators can be added behind explicit, tested contracts.

## Security and validation
Suite size, text size, case IDs, duplicate IDs, and weights are validated. The core performs no network calls and stores no secrets.

## SKYCOIN4444 integration
`toIntegrationReport` creates a stable report payload suitable for HopeAI experiment dashboards, model registries, or CI quality gates. Consumers decide thresholds and persistence.

## Validation
```sh
pnpm run check:packages
pnpm vitest run packages/sky-evaluation/src/index.test.ts
```
