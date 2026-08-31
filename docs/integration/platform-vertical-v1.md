# SKYCOIN4444 Platform Vertical v1

This is a **zero-count integration/hardening path**. It does not add another numbered product. Its purpose is to prove that existing SKYCOIN4444 product cores can participate in one fail-closed execution flow.

## Flow

`SkyIdentity → SkyAuth → SkyMFA → SkyPermissions → course adapter → SkyCredentials → SkyPayments plan → ledger adapter → notification adapter → SkyAudit`

## Directly integrated existing cores

- **SkyIdentity** — creates the stable local identity record used across the flow.
- **SkyAuth** — accepts only an already-verified session handoff and applies deterministic session policy.
- **SkyMFA** — evaluates step-up policy; this orchestrator also requires an explicitly satisfied eligible factor before continuing.
- **SkyPermissions** — applies deny-overrides/default-deny authorization before downstream effects.
- **SkyCredentials** — creates an education credential bound to the SkyIdentity ID after course enrollment succeeds.
- **SkyPayments** — produces an external authorization plan only; it does not execute payment settlement.
- **SkyAudit** — creates a deterministic local audit record for a successful orchestration.

## Adapter boundaries

The first integration deliberately keeps three downstream responsibilities behind narrow ports instead of inventing unverified APIs:

- course enrollment (`enrollCourse`)
- ledger planning (`planLedger`)
- notification planning (`planNotification`)

These adapters make the orchestration executable and testable while preserving the truth boundary around the current implementation. Future integration work can bind them to the canonical SkyCourses/SkyLedger/SkyNotificationsHub APIs after those concrete runtime contracts are independently reviewed.

## Fail-closed behavior

No course enrollment, credential creation, payment planning, ledger planning, notification planning, or success audit record is produced when any of these gates fails:

1. SkyAuth rejects the verified-session handoff.
2. The verified session subject does not match the SkyIdentity subject.
3. Required MFA assurance has not been explicitly satisfied.
4. SkyPermissions denies or default-denies the action.

The integration tests assert that downstream adapters are not called on these failures.

## Security and production limitations

This remains an **engineering-beta integration contract**, not proof of production deployment.

It does **not**:

- verify OAuth/JWT/password/passkey credentials;
- verify TOTP or WebAuthn/passkey proofs;
- provide KYC, proof-of-personhood, or identity-provider services;
- execute or settle payments;
- persist or settle ledger entries;
- send notifications to an external provider;
- provide durable workflow state or idempotent distributed orchestration;
- prove production tenancy isolation, HA, backups, monitoring, or compliance.

Payment, ledger, and notification outputs are explicit plans/contracts and retain `executeExternally: true` where applicable. External execution must be performed by separately reviewed infrastructure.

## Validation

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm exec vitest run server/features/platformVertical/index.test.ts
pnpm run check
pnpm run check:packages
pnpm run build
pnpm audit --prod --audit-level high
```
