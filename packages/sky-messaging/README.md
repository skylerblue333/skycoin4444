# SkyMessaging — Slot #101 / Lane 05

SkyMessaging is an **engineering-beta direct messaging domain core**. It models threads, participant access, idempotent message creation, editing, deletion, and notification metadata without claiming a live chat transport.

## Core behavior

- 2–50 validated unique participants per thread
- participant-only thread reads and message sends
- idempotent sends using caller-supplied request IDs
- sender-only edit/delete rules
- deleted message bodies are cleared from the in-memory record
- stable `MessagingNotificationContract` metadata for a future SkyNotificationsHub adapter
- injectable clocks and ID factories for deterministic tests
- timestamps must be non-negative safe integers and may not move backwards within a service instance
- equal-timestamp message ordering uses explicit JavaScript code-unit ordering rather than runtime locale collation

## Security/product boundary

This package is not end-to-end encryption, durable message storage, realtime delivery, abuse moderation, attachment scanning, presence, push notification delivery, identity verification, or production authorization middleware. Production adapters must authenticate actors before calling the library, provide durable access-controlled storage, enforce retention/legal policies, rate limits, moderation controls, encrypted transport, and notification delivery.

The in-memory clock guard prevents invalid or backwards timestamps from being committed by this domain core. It is not a distributed-clock synchronization guarantee and does not replace durable ordering/sequence controls in a production messaging store.

## Validation

```bash
pnpm run check:packages
pnpm exec vitest run --config packages/sky-messaging/vitest.config.ts
pnpm exec prettier --check packages/sky-messaging
```

Regression coverage includes invalid-clock rejection, backwards-clock rejection before persistence, and deterministic equal-timestamp ordering. The library has no added runtime dependencies. Repository CI is the merge authority.
