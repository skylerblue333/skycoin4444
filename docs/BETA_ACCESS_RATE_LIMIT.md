# Beta Access-Key Login Rate Limit

The invitation-only engineering beta applies a bounded login-attempt limiter to `POST /api/beta/access-login` when `VITE_BETA_AUTH_MODE=access_key`.

This control reduces repeated online credential attempts and protects the single-process beta from unbounded per-credential attempt state. It is not a distributed abuse-prevention service or a security certification.

## Default policy

- window: 300000 ms (5 minutes);
- maximum attempts: 12 per client/email pair per window;
- maximum tracked keys: 4096;
- scope: `process_local`.

After the threshold is reached, the route returns HTTP 429 with a `Retry-After` header and the generic error `too many beta sign-in attempts`.

Invalid invitation/key combinations below the limit continue to use the generic HTTP 403 response and do not reveal whether an email is invited.

## Privacy boundary

The limiter does not retain the submitted raw email or client IP as a map key. It stores a SHA-256 digest of the normalized email plus resolved client identifier.

This avoids keeping a direct in-memory registry of login emails/IPs, but the values necessarily exist transiently while the request is evaluated. This is not an anonymization guarantee.

## Client IP trust

By default, the limiter uses the direct socket remote address.

`BETA_TRUSTED_CLIENT_IP_HEADER` is opt-in. The production validator currently accepts only:

```
x-real-ip
```

Configure that value only on a hosting edge that is verified to replace/control the header. Do not switch the limiter to arbitrary `X-Forwarded-For` parsing.

For the verified Railway public-networking deployment, the operator may set:

```
BETA_TRUSTED_CLIENT_IP_HEADER=x-real-ip
```

The generic repository template leaves the value blank so another deployment platform does not inherit a Railway-specific trust assumption.

## Configuration

```
BETA_ACCESS_RATE_LIMIT_WINDOW_MS=300000
BETA_ACCESS_RATE_LIMIT_MAX_ATTEMPTS=12
BETA_ACCESS_RATE_LIMIT_MAX_KEYS=4096
BETA_TRUSTED_CLIENT_IP_HEADER=
```

Production startup validates all configured values. Invalid syntax, values outside the allowed bounds, or an unsupported trusted header fail the production configuration gate.

## Limits

This is deliberately an engineering-beta control:

- state exists only in the current Node process;
- counters reset when that process restarts;
- counters are not shared across replicas;
- a client/email pair can be temporarily denied even if the next credential would be correct;
- a distributed attacker can spread attempts across source addresses;
- this does not replace edge rate limiting, WAF controls, bot controls, or identity-provider abuse protection.

If the beta scales beyond one application replica or becomes broadly public, move the attempt state to a shared bounded store or enforce an equivalent verified edge policy.

## Verification

Unit and route-level tests cover:

- bounded numeric configuration;
- trusted-header validation;
- malformed header fallback;
- threshold denial;
- window reset;
- client/email isolation;
- bounded tracked-key capacity;
- the HTTP 429 + `Retry-After` route contract.

`GET /api/beta/auth` exposes only non-secret policy metadata so a hosted smoke test can verify the limiter is active without exposing tracked keys, client identifiers, invitation emails, or the access key.
