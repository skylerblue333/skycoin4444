# Session Signing-Key Rotation

## Purpose

SKYCOIN4444 supports a narrow two-key overlap for rotating the symmetric HS256 secret used by canonical stateless session JWTs.

The design is intentionally bounded: one active key and at most one previous verification-only key.

## Key roles

`JWT_SECRET`

- required;
- at least 32 bytes;
- signs every newly issued canonical session JWT;
- verifies JWTs signed by the active key.

`JWT_SECRET_PREVIOUS`

- optional;
- at least 32 bytes when configured;
- must differ from `JWT_SECRET`;
- verifies only;
- is never selected for new signatures.

No additional historical key ring is loaded.

## Verification behavior

The verifier checks the token with the active key first.

If active verification fails and a previous key is configured, the verifier checks the previous key. HS256 algorithm restriction and normal JWT expiration validation apply to both attempts.

When the previous key is removed, tokens signed only by that previous key stop authenticating even if their embedded expiration time has not yet passed.

## Controlled rotation procedure

Assume key A is currently active and key B is the new key.

1. Generate B independently in the approved secret-management process.
2. Deploy:
   - `JWT_SECRET=B`
   - `JWT_SECRET_PREVIOUS=A`
3. Confirm production configuration is valid.
4. Confirm a newly issued session is accepted under B.
5. Confirm an intentionally retained pre-rotation test session under A is accepted during the overlap.
6. Record the overlap end date.
7. At the planned end, remove `JWT_SECRET_PREVIOUS`.
8. Confirm the A-signed test token is rejected while a B-signed session remains accepted.

Never place either key value in release notes, issue comments, screenshots, application logs, or CI output.

## Choosing the overlap window

The current engineering-beta session TTL defaults to seven days and is bounded to at most 30 days.

However, older releases historically issued longer-lived JWTs. Therefore the current configured TTL cannot prove the remaining lifetime of every pre-rotation token.

Two valid strategies are:

- **compatibility-first:** retain A as the previous key for at least the maximum remaining lifetime of sessions that must remain valid;
- **security-first:** remove A earlier and intentionally force re-authentication for remaining A-signed sessions.

The chosen strategy and removal date must be explicit operational evidence.

Leaving a previous key configured indefinitely is not considered completed rotation.

## Emergency rotation

If the active signing secret is suspected compromised, compatibility with tokens signed by that secret may be undesirable.

An emergency response can deploy a new active key without configuring the compromised key as `JWT_SECRET_PREVIOUS`. That intentionally invalidates existing sessions signed by the old key.

This source-level capability is not an incident-response service and does not prove the hosting environment can rotate secrets without downtime.

## Configuration validation

Production configuration fails closed when:

- `JWT_SECRET` is shorter than 32 bytes;
- `JWT_SECRET_PREVIOUS` is present but shorter than 32 bytes;
- active and previous secrets are identical.

Blank/absent `JWT_SECRET_PREVIOUS` means no rotation overlap.

## Limitations

This feature does not provide:

- asymmetric signing;
- KMS/HSM-backed signing;
- automatic key generation;
- automatic rotation schedules;
- automatic secret-manager updates;
- per-token revocation;
- key identifiers or a multi-key JWKS;
- proof of external secret storage;
- production incident-response certification.

It is an engineering-beta bounded symmetric-key rotation mechanism.
