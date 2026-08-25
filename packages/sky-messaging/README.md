# SkyMessaging — Slot #101 / Lane 05

SkyMessaging is an **engineering-beta direct messaging domain core**. It models threads, participant access, idempotent message creation, editing, deletion, and notification metadata without claiming a live chat transport.

## Core behavior

- 2–50 validated unique participants per thread
- participant-only thread reads and message sends
- idempotent sends using caller-supplied request IDs
- sender-only edit/delete rules
- deleted message bodies are cleared from the in-memory record
- stable `MessagingNotificationContract` metadata for a future SkyNotificationsHub adapter
- deterministic injectable clocks and ID factories

## Security/product boundary

This package is not end-to-end encryption, durable message storage, realtime delivery, abuse moderation, attachment scanning, presence, push notification delivery, identity verification, or production authorization middleware. Production adapters must authenticate actors before calling the library, provide durable access-controlled storage, enforce retention/legal policies, rate limits, moderation controls, encrypted transport, and notification delivery.

## Validation

```bash
pnpm run check:packages
pnpm exec vitest run --config packages/sky-messaging/vitest.config.ts
pnpm exec prettier --check packages/sky-messaging
```

The library has no added runtime dependencies. Repository CI is the merge authority.
