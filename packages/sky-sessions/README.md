# SkySessions — Slot #65 / Lane 05

SkySessions is an **engineering-beta domain library** for deterministic session and device lifecycle decisions inside SKYCOIN4444. It is intentionally not described as a deployed authentication service.

## Product core

- creates session metadata with caller-injected identifiers
- enforces absolute and idle expiration policies
- limits concurrent active sessions per user
- supports touch, targeted revoke, and bulk revoke-except-current flows
- validates user/device/session identifiers and revoke reasons
- emits metadata-only audit events
- exposes a minimal `SessionAuthContext` contract for an authentication boundary
- uses an injectable store, clock, and ID factory so tests are deterministic

## Security boundary

SkySessions stores **session metadata only**. It does not issue cookies, sign JWTs, persist bearer tokens, encrypt databases, perform MFA, authenticate identities, or claim production security enforcement. A production adapter must provide durable storage, cryptographically strong opaque identifiers, authenticated request handling, CSRF/cookie protections where applicable, revocation propagation, and monitoring.

The default ID factory is suitable only for local library use; callers integrating this package into a security-sensitive runtime must inject a cryptographically strong identifier generator. No external identity provider or KMS connection is claimed.

## Integration contract

`toAuthContext(sessionId)` returns only `{ sessionId, userId, deviceId, status }`. This gives SkyAuth or another authentication adapter a stable boundary without coupling this library to a provider. `SessionAuditEvent` provides a metadata-only event contract suitable for a future SkyAudit adapter.

## Validation

From the repository root:

```bash
pnpm run check:packages
pnpm exec vitest run packages/sky-sessions/src/index.test.ts
pnpm exec prettier --check packages/sky-sessions
```

The package has no runtime dependencies; dependency risk is inherited only from the repository toolchain used to typecheck/test it. Repository CI remains authoritative for merge readiness.
