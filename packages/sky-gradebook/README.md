# SkyGradebook — Slot #119 / Lane 05

SkyGradebook is an **engineering-beta grade-record domain core** for SKYCOIN4444 education workflows.

It provides validated grade items, bounded integer point recording, deterministic course summaries, and a `GradebookProgressContract` that a learning-path or credential adapter can consume.

It does **not** claim accreditation, official transcript authority, SIS/LMS integration, FERPA compliance certification, identity verification, durable storage, instructor authorization, or legal record retention. Production adapters must authenticate educators, enforce course enrollment/permissions, persist records durably, log changes, apply retention/privacy policy, and determine institution-specific grading rules.

Validation from the repository root:

```bash
pnpm run check:packages
pnpm exec vitest run --config packages/sky-gradebook/vitest.config.ts
pnpm exec prettier --check packages/sky-gradebook
```

The library adds no runtime dependencies. Repository CI is authoritative for merge readiness.
