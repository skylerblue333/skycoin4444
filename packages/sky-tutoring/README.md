# SkyTutoring — Wave 2 Slot #117

SkyTutoring is an **engineering-beta tutoring-session orchestration core** for SKYCOIN4444 education products. It validates session inputs, enforces a scheduled → active → completed lifecycle, supports cancellation rules, and emits a stable classroom-facing event contract.

## Truth boundary
This package does not provide a live AI tutor, human tutor marketplace, video calling, payments, scheduling-provider integration, or educational outcome guarantees. It is a deterministic local domain core.

## Security and validation
Session, learner, and subject identifiers/text are bounded; timestamps and durations are validated; invalid state transitions are rejected. No secrets or network calls are used.

## Integration
`toClassroomEvent` emits `skytutoring.session.v1`, suitable for SkyClassroom, SkyCourses, or notification orchestration. Consumers remain responsible for identity, authorization, persistence, and delivery.

## Validation
```sh
pnpm run check:packages
pnpm vitest run packages/sky-tutoring/src/index.test.ts
```
