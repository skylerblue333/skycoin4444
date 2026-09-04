# Session Security

## Purpose

SKYCOIN4444's canonical invitation-beta authentication issues a signed JWT in an HttpOnly browser cookie.

The session lifetime is now explicit, bounded, and shared between the JWT expiration and cookie lifetime so the two cannot silently drift.

## Canonical lifetime

`SESSION_TTL_MS`

Default: 604800000 ms (7 days).

Allowed range:

- minimum: 900000 ms (15 minutes);
- maximum: 2592000000 ms (30 days).

The parser requires a safe integer inside that range. Malformed, fractional, too-short, and excessive values are rejected.

Production configuration inspection includes this policy, so an invalid configured TTL prevents a production beta from passing startup configuration validation.

## JWT and cookie alignment

On an accepted OAuth callback:

1. the canonical session policy resolves one `sessionTtlMs`;
2. the SDK signs the JWT with expiration based on that exact value;
3. the session cookie receives the same value as `Max-Age`.

The SDK also applies the same hard bounds when another internal caller explicitly requests `expiresInMs`.

This removes the previous one-year default from canonical session issuance.

## Production cookie isolation

Canonical production browser sessions use `__Host-app_session_id`.

The `__Host-` cookie prefix gives the browser an enforceable host-only boundary: the cookie must be Secure, must use `Path=/`, and cannot carry a Domain attribute. This reduces parent-domain/sibling-cookie shadowing and cookie-tossing risk for the authenticated session name.

Non-production environments retain `app_session_id` so local HTTP development remains possible.

Migration behavior is fail-closed:

- production authentication reads only `__Host-app_session_id`;
- production CSRF/origin detection considers only that active cookie name;
- successful production OAuth login clears the old `app_session_id` cookie before/while establishing the new session;
- production logout clears both the host-prefixed and legacy names.

A user with only the legacy production cookie may need to authenticate again. No old-cookie compatibility authentication is claimed.

## Token input boundary

Before HS256 verification, the canonical verifier applies a narrow compact-JWT input boundary:

- token length must be 1–4096 characters;
- token must contain exactly three segments;
- every segment must be non-empty;
- every segment must contain only base64url characters `A-Z a-z 0-9 _ -`.

Malformed or oversized values are rejected before cryptographic verification. Signature verification additionally requires HS256 and the canonical `typ: JWT` protected-header value.

This is an application-level bound beneath the HTTP server's broader header-size behavior. It does not replace transport/proxy header limits.

Newly issued canonical session JWTs also include an `iat` issued-at timestamp. Existing signature, expiration, application-identity, and admission checks remain separate controls.

## Signing-key rotation

The canonical JWT verifier supports one optional previous signing secret during a controlled rotation.

- `JWT_SECRET` is active and signs every new token.
- `JWT_SECRET_PREVIOUS` is optional and verification-only.
- both configured values must be at least 32 bytes;
- the previous value must differ from the active value;
- no third or historical key ring is accepted.

A token is checked against the active key first and, only when a previous key is configured, against that previous key. Expiration and HS256 algorithm verification still apply under either key.

See `docs/SESSION_KEY_ROTATION.md`.

## OAuth state is separate

The OAuth CSRF nonce/state cookie remains a separate short-lived login artifact with its existing 10-minute lifetime.

Reducing or configuring authenticated-session lifetime does not change the OAuth callback nonce binding.

## Logout and revocation boundary

The canonical session is currently a stateless signed JWT.

Logout clears the browser session cookie. That prevents the normal browser from continuing to send the cookie, but it does not create a server-side revocation record for a copied token.

A valid copied JWT may remain cryptographically valid until:

- its expiration time;
- the signing secret changes;
- or a future verified server-side session/revocation mechanism is integrated.

Invitation admission is re-checked during protected authentication, so removing an account from the beta allowlist remains a separate fail-closed access control even while a JWT's signature is still valid.

## SkySessions package boundary

`packages/sky-sessions` contains a tested session domain core with absolute/idle TTL and revocation concepts.

The canonical OAuth runtime does not currently use that package as a durable session store. Its existence must not be described as proof of server-side revocation for the current JWT cookie.

## Verification

Focused tests cover:

- default 7-day lifetime;
- 15-minute minimum;
- 30-day maximum;
- malformed and excessive-value rejection;
- caller-requested JWT lifetime bounds.

Canonical exact-head CI additionally covers the full typecheck, package tests, integration tests, build, scans, and production dependency audit.

Deployment verification should additionally record an issued JWT expiration and cookie `Max-Age` from the exact candidate release without publishing the token itself.

## Limitations

This change does not establish:

- server-side session revocation;
- device/session inventory for canonical OAuth;
- refresh-token rotation;
- idle-session expiration;
- concurrent-session caps;
- token theft detection;
- automatic signing-key rotation scheduling or secret-manager integration;
- external identity-provider assurance;
- production security certification.
