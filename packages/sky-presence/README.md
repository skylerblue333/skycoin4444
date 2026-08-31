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

Identifiers are allow-list validated, policy thresholds are range-checked, and future heartbeats are rejected. `observedAt` and caller-supplied `now` must be canonical UTC ISO-8601 instants in `YYYY-MM-DDTHH:mm:ss.sssZ` form. Accepted values are round-tripped through `Date.toISOString()`, which rejects impossible calendar values that permissive date parsing could otherwise normalize silently.

This strict representation is a domain-input integrity rule, not a distributed clock-synchronization guarantee. Integrators must authenticate heartbeat writers, rate-limit updates, establish trusted time sources where required, and avoid exposing presence to unauthorized viewers.

## Validation

```sh
pnpm exec vitest run packages/sky-presence/src/index.test.ts
pnpm run check:packages
pnpm exec prettier --check packages/sky-presence
pnpm audit --audit-level high
```

Regression coverage includes impossible calendar dates and non-canonical timestamp representations. Repository CI remains the merge authority.
