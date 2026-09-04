# Request Security Boundary

## Cookie-authenticated unsafe requests

The canonical browser client sends tRPC requests with `credentials: "include"`. The session cookie currently uses `SameSite=None` because the authentication/runtime environment may require cross-site cookie availability.

That combination requires an explicit cross-site request boundary for state-changing requests.

The server now evaluates POST, PUT, PATCH, and DELETE requests that contain the SKYCOIN4444 session cookie. In production they are accepted only when:

- `BETA_PUBLIC_ORIGIN` is configured as the canonical HTTPS origin;
- the browser `Origin` header normalizes to exactly that origin;
- `Sec-Fetch-Site`, when supplied, is not `cross-site`.

Missing, malformed, or mismatched production origins fail closed with HTTP 403.

## Bearer clients

Requests without the ambient session cookie are not forced through this browser-origin check. This preserves non-browser Bearer-token integrations because an Authorization header is not an ambient browser credential.

If both a session cookie and Bearer header are present, the cookie-origin rule still applies because the current authentication layer prioritizes the session cookie.

## Development behavior

Outside production, origin-less local scripts are allowed so local smoke tooling can continue to exercise the API. Browser requests that do provide an Origin are compared with the current request origin.

This relaxed local behavior is not used in production.

## Correlation headers

`X-Request-ID` is not an authentication or trust signal. The server always creates its own canonical request ID. A caller value is accepted only into a separately labeled external-correlation field when it matches the strict bounded syntax documented in `docs/OBSERVABILITY.md`.

Authorization, admission, CSRF/origin checks, and audit identity never rely on a caller-selected request ID.

## Session credential input

Cookie and Bearer session credentials are eventually processed by the same canonical JWT verifier. Before signature work, the token must be a compact three-segment base64url JWT no larger than 4096 characters.

This reduces avoidable cryptographic work on malformed or oversized credential values. It does not claim a WAF, reverse-proxy header limit, distributed abuse control, or token-theft detection.

## Session lifetime and revocation

The canonical browser cookie and signed JWT use the same bounded absolute lifetime from `SESSION_TTL_MS`. The beta default is 7 days and the hard maximum is 30 days.

Logout clears the browser cookie. The current canonical JWT is stateless, so this does not prove immediate server-side revocation of a token copied before logout. Admission policy is re-checked on protected requests, providing separate invitation removal enforcement.

See `docs/SESSION_SECURITY.md`.

## Cookie transport

Production session cookies are always marked `Secure`. Development still derives Secure from the request so HTTP localhost testing remains possible.

## Scope and limitations

This control is a CSRF/same-origin boundary for ambient cookie mutations. It is not:

- a WAF;
- bot detection;
- distributed abuse prevention;
- a replacement for authorization;
- a claim of penetration testing or audited security.

Authorization remains enforced separately by the tRPC procedure layer. Runtime overload controls and security headers remain separate controls.
