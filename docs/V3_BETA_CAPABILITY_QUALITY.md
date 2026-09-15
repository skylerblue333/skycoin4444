# SKYCOIN4444 V3 Beta Capability Quality Standard

V3 treats code evidence as more important than inflated feature or line counts.

## Current portfolio metric

The canonical V3 route catalog is generated from `client/src/App.tsx` and contains more than 1,000 unique static routes. A route is an interface surface, not automatic proof that the underlying capability is production-complete.

Run:

```bash
pnpm audit:v3-capabilities
```

The audit maps registered routes back to page source files and reports repository implementation signals.

## What the audit measures

For each static route the audit records:

- canonical path, component, and searchable label;
- inferred product domain;
- source-file mapping;
- source size and non-blank line count;
- interaction, state, and data-call signals;
- TODO/FIXME/mock/placeholder/stub/coming-soon review markers;
- a heuristic implementation signal: `substantial`, `moderate`, `thin`, `needs-review`, or `unmapped`.

These signals are prioritization aids. They are **not** production-readiness, security, compliance, revenue, custody, payment, blockchain, or external-provider certifications.

## CI gates

The required `validate` workflow now runs the V3 capability audit. It fails when:

- the static route portfolio falls below 1,000 routes; or
- fewer than 85% of registered static routes can be mapped back to source.

Review-marker counts and implementation-signal counts are reported but do not fail the build by themselves. That keeps the audit truthful while creating a measurable backlog for hardening.

## Business-value rule

Do not optimize SKYCOIN4444 for arbitrary targets such as 600,000 lines of code or 2,000 claimed features. Those numbers can be increased without making the product better.

V3 should instead improve the evidence behind five outcomes:

1. **Activation** — a new beta user can understand the product and complete a useful first journey.
2. **Retention** — social, learning, creator, gaming, and productivity loops save real state and invite repeat use.
3. **Trust** — authentication, authorization, moderation, privacy, auditability, and high-risk financial boundaries fail closed.
4. **Monetization readiness** — commerce and paid-product surfaces have explicit integration contracts without fabricating live settlement or custody.
5. **Operability** — builds, tests, health checks, database readiness, observability, rollback, and release evidence are repeatable.

A smaller capability with tests, persistence, security boundaries, telemetry, and a complete user journey is more valuable than dozens of decorative pages.

## Suggested V3 hardening order

Use the audit output to prioritize:

1. `unmapped` routes;
2. `needs-review` routes in high-value domains;
3. `thin` routes that are part of core beta journeys;
4. missing persistence or API contracts;
5. missing integration, failure-path, accessibility, and authorization tests.

The operational-readiness page exposes the generated route count and explicitly labels it as interface inventory rather than completed-feature count.
