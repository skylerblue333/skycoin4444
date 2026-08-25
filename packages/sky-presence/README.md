# SkyPresence — Slot #102 / Lane 06

SkyPresence is an engineering-beta presence/availability domain library. It derives online, away, or offline state from caller-supplied heartbeat timestamps using explicit thresholds.

## Boundaries

- No WebSocket, push, mobile, or device provider is connected.
- Presence is inferred from submitted heartbeats; it is not proof that a human is actively using a device.
- No tracking, geolocation, identity verification, or production enforcement is performed.
- Persistence, transport, authentication, and privacy policy are integration responsibilities.

## SKYCOIN4444 integration contract

Chat, feed, classroom, and collaboration adapters may store normalized `PresenceHeartbeat` records, select a user's latest heartbeat, and call `derivePresence(heartbeat, now, policy)`. The caller supplies `now`, keeping tests deterministic and avoiding hidden wall-clock behavior.

## Security notes

Identifiers are allow-list validated, timestamps must parse, future heartbeats are rejected, and policy thresholds are range-checked. Integrators must authenticate heartbeat writers, rate-limit updates, and avoid exposing presence to unauthorized viewers.

## Validation

```sh
pnpm exec vitest run packages/sky-presence/src/index.test.ts
pnpm run check:packages
pnpm exec prettier --check packages/sky-presence
pnpm audit --audit-level high
```
