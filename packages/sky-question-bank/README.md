# SkyQuestionBank — Slot #120 / Lane 06

SkyQuestionBank is an engineering-beta education domain library for validated multiple-choice questions, deterministic grading, and tag filtering.

## Boundaries

- No AI generation, tutoring, proctoring, credential issuance, or LMS provider is connected.
- Correct answers are caller-authored data; the library does not determine factual truth.
- Persistence, permissions, versioning, authoring UI, and attempt history are integration responsibilities.

## SKYCOIN4444 integration contract

SkySchool/course adapters can normalize authored items to `MultipleChoiceQuestion`, validate them before persistence, use `filterQuestionsByTag` to build bounded pools, and call `gradeAnswer` for deterministic objective grading.

## Security notes

Question IDs, tags, prompt lengths, choice counts, answer indices, and submitted indices are validated. Integrators must protect answer keys from unauthorized clients and authorize authoring changes.

## Validation

```sh
pnpm exec vitest run packages/sky-question-bank/src/index.test.ts
pnpm run check:packages
pnpm exec prettier --check packages/sky-question-bank
pnpm audit --audit-level high
```
