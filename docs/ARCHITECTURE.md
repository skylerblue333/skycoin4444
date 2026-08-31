# SKYCOIN4444 Architecture

## Scope

This document describes the current engineering-beta architecture on the default branch. It is not a production deployment diagram and does not claim that every package or page is wired into the runtime.

## Canonical layers

### Application workspace

The root pnpm workspace controls the canonical build, test, typecheck, migration, and runtime commands. The root `package.json` and lockfile are release-critical configuration.

### Server runtime

`server/_core/index.ts` is the canonical server entry point for development and the bundled production build. Supporting code is organized across:

- `server/_core/*` — runtime infrastructure, context, environment, provider helpers, OAuth/session support, notification, storage proxying, SDK/system helpers;
- `server/routers.ts` and `server/routers/*` — API/tRPC composition;
- `server/features/*` — feature implementations;
- `server/db.ts` — database integration boundary;
- `server/storage.ts` — storage-facing logic.

Database configuration and migrations are high-risk boundaries. The presence of schema code does not prove a live production database exists or has been migrated.

### Client runtime

`client/` is the canonical frontend tree. It contains a broad UI surface, including historical/generated/demo-oriented pages. A page file is not sufficient evidence of a production workflow; canonical UI status requires a verified backing contract and failure behavior.

### Product/domain packages

`packages/*` contains independently testable domain cores, validators, planners, registries, adapters, and product contracts. Package existence proves a code artifact exists; it does not automatically prove server exposure, UI integration, provider connectivity, persistence, or production readiness.

### Cross-product integration

The first verified integration vertical connects:

`SkyIdentity -> SkyAuth -> SkyMFA -> SkyPermissions -> course adapter -> SkyCredentials -> SkyPayments planning -> ledger adapter -> notification adapter -> SkyAudit`

Security and financial decision points are required to fail closed. Course, ledger, and notification adapters are deliberately narrow where full production runtime APIs have not been independently established.

## Control flow

1. Identity/authentication inputs are validated before downstream authorization.
2. MFA and permission decisions gate privileged progression.
3. Credential and course boundaries operate only after the security gates succeed.
4. Payment behavior is planning/domain logic unless a live provider-backed settlement path is independently verified.
5. Ledger/notification adapters receive bounded events rather than being treated as proof of durable external delivery.
6. Audit receives structured events describing the engineering-beta control path.

## Data boundaries

- **Identity/session data:** treat as security-sensitive; no production identity-provider guarantee.
- **Financial data:** planning/domain state is not live settlement or custody.
- **Database state:** local/configured persistence only unless an external deployment is independently verified.
- **AI/provider data:** provider helper code does not prove live model connectivity.
- **Web3 data:** domain validation/planning does not prove chain execution, custody, or deployed contracts.

## Release-critical surfaces

Changes to the following require focused review and exact-head CI:

- `.github/workflows/*`;
- root package manifests and lockfile;
- `server/_core/*`;
- auth/session/MFA/permission code;
- payment/ledger/accounting/treasury code;
- persistence/migration code;
- secrets/privacy/audit/policy code;
- cross-product integration tests and adapters.

## Legacy and historical content

Historical audits and generated/demo surfaces remain useful evidence, but they are not authoritative when newer default-branch code or exact-head CI contradicts them. Cleanup must be evidence-based and should not delete security, financial, or persistence code merely because it appears old or duplicated.
