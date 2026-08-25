# SkyAuth — Slot #62 / Lane 02

## Status

SkyAuth is an **engineering-beta authentication/session boundary library** for SKYCOIN4444. It converts session claims that have already been cryptographically verified by an upstream verifier into a narrow application principal after deterministic policy checks.

It is not a hosted identity provider and does not claim production authentication enforcement by itself.

## Product core

`server/features/auth/skyAuth.ts` validates:

- subject and session identifiers;
- supported authentication method metadata;
- issued/expiry timestamps;
- maximum session lifetime;
- bounded clock skew;
- expiration.

Invalid untrusted input is rejected with stable machine-readable decision codes.

## Security boundary

SkyAuth **does not**:

- verify JWT/JWS signatures;
- exchange OAuth authorization codes;
- validate passwords or passkeys;
- perform MFA;
- connect to an external identity provider;
- create or persist sessions;
- establish regulatory/compliance status.

Cryptographic verification and identity-provider communication remain upstream responsibilities. This boundary is deliberate so callers cannot mistake decoded or caller-supplied claims for verified identity.

## SKYCOIN4444 integration contract

The existing flagship server already authenticates requests through `sdk.authenticateRequest` in `server/_core/context.ts` and performs OAuth callback/session issuance in `server/_core/oauth.ts`.

A future integration may pass only **already verified** session metadata from that upstream authentication layer into `authenticateVerifiedSession` before exposing a principal to authorization modules such as SkyPermissions. The current product does not modify the live request path because doing so without a verified SDK/session contract would risk fabricating security guarantees.

Expected handoff shape:

```ts
{
  subject: string,
  sessionId: string,
  issuedAtMs: number,
  expiresAtMs: number,
  authMethod: "oauth" | "password" | "passkey" | "service"
}
```

## Validation

Deterministic Vitest coverage verifies valid principals, expiry, unsafe identifiers, unsupported methods, excessive lifetime, and future-issued sessions. The dedicated CI workflow runs formatting checks, targeted tests, repository typecheck, production build, and a production dependency audit at the critical severity threshold.
