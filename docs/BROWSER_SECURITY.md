# Browser and Privacy Hardening

## Purpose

The canonical engineering-beta server now applies a deliberate browser-response policy instead of relying on a few ad hoc headers. The policy is environment-aware so Vite development/HMR remains usable while the production server receives stronger browser isolation.

## Production Content Security Policy

Production responses receive a Content-Security-Policy that:

- defaults resources to the same origin;
- restricts base URLs and form submission to the same origin;
- disables plugin/object content;
- prevents the application from being framed;
- blocks inline HTML event-handler attributes;
- does not permit `unsafe-eval`;
- allows self-hosted script elements and bounded inline script elements needed by the current generated runtime;
- allows inline styles because the React UI uses style attributes/runtime styling;
- permits HTTPS images/fonts/media and HTTPS/WSS API connections for explicitly configured future providers;
- upgrades insecure subresource requests.

The policy is intentionally not described as a perfect XSS boundary because `script-src` currently permits inline script elements for runtime compatibility. `script-src-attr 'none'` still blocks inline event-handler attributes.

## Additional response controls

All environments receive:

- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- a restrictive `Permissions-Policy` for camera, microphone, geolocation, and payment;
- `X-Frame-Options: DENY`;
- `Cross-Origin-Opener-Policy: same-origin-allow-popups`;
- `Cross-Origin-Resource-Policy: same-origin`;
- `Origin-Agent-Cluster: ?1`;
- disabled DNS prefetching.

Production also receives one-year HSTS without `includeSubDomains`. This avoids claiming that every sibling subdomain is already HTTPS-ready.

## Analytics/privacy boundary

The canonical `client/index.html` previously loaded an unconditional Umami-style analytics script using unresolved Vite placeholders.

That implicit hook has been removed. The engineering beta now loads no analytics script by default. A future analytics provider must be added as an explicit, reviewed integration with:

- a named provider and endpoint;
- privacy/consent review;
- CSP update;
- data classification;
- failure behavior;
- release evidence.

## Development behavior

CSP and HSTS are not emitted in development because Vite HMR and local HTTP testing require a looser transport/runtime model. Baseline browser headers still apply.

## Limitations

These controls are not:

- a penetration test;
- a Web Application Firewall;
- complete XSS proof;
- third-party script certification;
- evidence of a production TLS deployment.

They are source-level browser hardening for the canonical server and must still be verified in any deployed beta environment.
