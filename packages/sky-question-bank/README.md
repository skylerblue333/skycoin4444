# SkyQuestionBank — Slot #120 / Lane 06

SkyQuestionBank is an engineering-beta education domain library for validated multiple-choice questions, deterministic grading, tag filtering, bounded quiz-session assembly, session grading, and review queues.

## Supported behavior

- validates authored multiple-choice questions;
- grades objective answers deterministically;
- filters bounded question pools by tag;
- creates deterministic seeded quiz sessions;
- strips answer keys from public session questions;
- grades session submissions against caller-supplied trusted question definitions;
- returns review queues for missed questions;
- rejects duplicate question IDs, duplicate submissions, out-of-session answers, malformed indices, and oversized sessions.

## Boundaries

- No AI generation, tutoring, proctoring, credential issuance, or LMS provider is connected.
- Correct answers are caller-authored data; the library does not determine factual truth.
- A quiz score is not a credential, educational certification, or proof of real-world mastery.
- Persistence, permissions, versioning, authoring UI, and attempt history are integration responsibilities.
- Trusted answer definitions belong on the server or another protected execution boundary; public quiz sessions intentionally omit `correctIndex`.

## SKYCOIN4444 integration contract

SkySchool/course adapters can normalize authored items to `MultipleChoiceQuestion`, validate them before persistence, use `buildQuizSession` for deterministic bounded practice sets, call `gradeQuizSession` for objective scoring, and use `buildReviewQueue` to direct learners back to missed concepts.

The Impact Mission Hub can use tagged question pools as learning checkpoints while keeping game scores, social activity, charity planning, and external outcomes separate from educational proof.

## Security notes

Question IDs, tags, prompt lengths, choice counts, answer indices, submitted indices, session size, duplicate IDs, and duplicate submissions are validated. Integrators must protect answer keys from unauthorized clients and authorize authoring changes.

## Validation

```sh
pnpm exec vitest run packages/sky-question-bank/src/index.test.ts
pnpm run check:packages
pnpm exec prettier --check packages/sky-question-bank
pnpm audit --audit-level high
```
