# Observability Trust Boundary

## Purpose

SKYCOIN4444 uses request correlation and application logging for engineering-beta diagnostics.

Correlation identifiers and error text cross trust boundaries, so the canonical server now distinguishes internal identity from caller metadata and applies one shared redaction layer before selected operational error logging or durable outbox failure storage.

## Canonical request ID

For every HTTP request the observability middleware generates a fresh internal UUID.

That value is:

- stored in the async request context;
- used by the tRPC context when available;
- returned as the response `X-Request-ID`;
- written as the canonical `requestId` in the HTTP request signal.

A remote caller cannot select this canonical identifier.

If the tRPC context is constructed without the normal observability middleware, its fallback request ID is also freshly generated and never copied from a request header.

## External correlation ID

A caller or upstream proxy may supply `X-Request-ID`.

That value is untrusted. It is retained only when:

- trimmed length is 1–64 characters;
- the first character is alphanumeric;
- every remaining character is alphanumeric or one of `.`, `_`, `:`, `-`.

Valid caller values are recorded separately as `externalRequestId`.

Malformed, whitespace-containing, control-character, or oversized values are discarded.

The external ID is never used as:

- authentication identity;
- authorization identity;
- audit actor identity;
- idempotency identity;
- canonical request identity.

## HTTP request signal

The application request signal contains:

- event name;
- canonical internal request ID;
- optional external request ID;
- method;
- path;
- response status;
- duration.

It does not intentionally include request bodies, cookies, Authorization headers, query values, or session tokens.

## Shared operational-error sanitizer

The canonical runtime shares one bounded error-summary sanitizer across startup, fatal monitoring, OAuth/auth failure logging, and outbox failure handling.

The sanitizer operates on an Error name/message or string representation, flattens whitespace, and bounds output length.

Targeted redaction includes:

- URI username/password credentials;
- common password, token, access-token, refresh-token, client-secret, and API-key query values;
- common secret key/value forms;
- Bearer-token forms;
- JWT-shaped values.

This is targeted best-effort redaction. It is not a proof that every arbitrary secret format can be recognized.

## OAuth/auth logging

The OAuth SDK no longer logs the configured provider base URL during initialization. It logs only whether provider configuration is present.

OAuth callback and user-sync/session-verification failures pass through the shared sanitizer rather than logging raw error objects.

## Outbox failure storage

Outbox consumer/dispatch failures use the same sanitizer for application logging.

Before a failure string is written to `event_outbox.last_error`, it is sanitized. This reduces the chance that provider/database credential material becomes durable dead-letter metadata.

The admin dead-letter API still does not expose `last_error`.

## Fatal and platform logs

The fatal-runtime application record uses the shared sanitizer, but Node may still print its own fatal stack trace.

Likewise, hosting providers, reverse proxies, database drivers, cloud agents, or third-party libraries may emit logs outside this application sanitizer.

Those external logging systems require separate configuration and evidence.

## Hosted engineering-beta monitoring

The canonical V5 beta is additionally observed through two provider/external layers:

- Railway exposes deployment logs, HTTP request signals, and CPU/memory/network resource metrics for the hosted service; the managed MySQL service exposes CPU/memory/disk/network resource metrics.
- `.github/workflows/hosted-beta-health-monitor.yml` performs an independent public smoke every 15 minutes from GitHub Actions. It checks the home/sign-in surfaces plus beta health, beta readiness, runtime readiness, authentication configuration, database/configuration state, the explicit no-live-financial-or-chain-execution safety boundary, and the deployed release SHA.

Scheduled and manually dispatched monitor runs reconcile one repository-native operational alert:

- the first non-success result opens one issue titled `[ops] Hosted beta health monitor incident` and assigns it to the repository owner;
- the incident records a machine-readable consecutive-failure count plus the first and latest failing source SHAs;
- failures 1–2 are classified **SEV-3**, failures 3–5 **SEV-2**, and 6+ consecutive failures **SEV-1**;
- later failed runs update the same incident instead of creating duplicates, and a comment is added only when the severity crosses an escalation threshold;
- GitHub control-flow results `cancelled` and `skipped` leave incident state untouched; unexpected result strings fail closed instead of being treated as outages;
- the first later successful run comments with the recovery SHA/run and prior failure streak, then closes the incident;
- pull-request checks never receive `issues: write` and never mutate incident state;
- GitHub API calls from the incident reconciler are time-bounded and GitHub API/server origins reject embedded credentials;
- the incident body contains source/run metadata only, not invitation credentials, session tokens, provider secrets, or request bodies.

The workflow keeps default `contents: read` permission. Only the scheduled/manual incident job receives scoped `issues: write` permission.

This monitor is intentionally credential-free and therefore does not exercise authenticated user persistence. It complements, but does not replace, the bounded hosted load baseline in `scripts/hosted-load-baseline.mjs`.

## Verification

Focused tests cover:

- server-generated canonical IDs;
- caller ID separation;
- strict external-ID syntax and length;
- request-signal metadata shape;
- URI/password/token/Bearer/JWT redaction;
- whitespace flattening and output bounds;
- existing fatal/startup redaction compatibility;
- hosted incident creation on first failure;
- duplicate suppression while an incident is open;
- recovery comment and automatic incident closure;
- monitor token non-disclosure in incident test output/body.

Hosted verification additionally requires the scheduled smoke workflow to execute successfully against the canonical V5 origin.

Canonical exact-head CI remains required before merge.

## Limitations

This work does not establish:

- a centralized logging/SIEM provider independent of Railway;
- guaranteed centralized log retention;
- tamper-proof logging;
- distributed trace propagation;
- OpenTelemetry export;
- pager/phone/SMS/on-call delivery or an SLA/SLO-based external paging policy;
- complete secret detection;
- external proxy/header trust configuration;
- production security certification.

The scheduled GitHub Actions monitor plus assigned, deduplicated, severity-escalating GitHub incident is a repository-native external availability/configuration alert. It is not an uptime SLA, phone/SMS/pager delivery, an independent incident-management provider, or production observability certification.
