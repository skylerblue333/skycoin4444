# Sky Enterprise Foundation

Reusable enterprise primitives incorporated into the SKYCOIN4444 flagship from three existing public MIT-licensed repositories owned by `skylerblue333`.

## Reused technology

- `Sky-SkyEnterprise` @ `d64edb7f7787393229de99cd9393e4542fecc490`
  - organization membership and seat limits
  - owner/admin/member authorization boundaries
  - project registry and lifecycle rules
  - contract metadata and lifecycle rules
- `skycoin-security` @ `be04350399870257e60702819cc931d1e76f990c`
  - deterministic default-deny policy evaluation
  - AES-256-GCM authenticated encryption envelopes
- `skycoin-analytics` @ `170b5f197a618880d36160c2947de147511413da`
  - bounded in-memory event aggregation and dimensions

The original source repositories remain authoritative for their standalone packages. This package is the flagship integration copy, adapted to repository formatting and TypeScript conventions.

## Truth boundaries

This is an engineering-beta foundation library. It does not claim durable multi-tenant persistence, SSO execution, production KMS/HSM key custody, legal contract validity, e-signatures, compliance certification, distributed analytics, or external provider execution.

Use the enterprise adapter registry for provider capability/configuration contracts. Use this package for local domain policy, bounded analytics, organization/project/contract rules, and caller-managed encryption primitives.
