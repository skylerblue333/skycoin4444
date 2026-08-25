# SkyMFA — Wave 2 Slot #63

SkyMFA is an **engineering-beta MFA policy/domain core** for SKYCOIN4444. It decides when a previously primary-authenticated session requires additional assurance and which enrolled factor types can satisfy that policy.

## What it does
- evaluates sensitive-action and caller-supplied risk policies;
- supports policy metadata for TOTP, passkey, and recovery-code enrollments;
- distinguishes ordinary MFA from phishing-resistant assurance;
- validates untrusted identifiers, action names, risk scores, and enrollment timestamps;
- exposes a deterministic contract suitable for SkyAuth/SkyPermissions integration.

## Integration contract
`evaluateMfa(AuthContext, FactorEnrollment[], MfaPolicy)` consumes a primary-authentication result from the authentication boundary and returns a policy decision. A caller such as SkyAuth can deny or step-up an action when `required` is true; SkyPermissions can use the resulting assurance level as authorization context.

## Security and truth boundaries
SkyMFA **does not verify TOTP codes, WebAuthn/passkey signatures, recovery codes, identities, or external providers**. It stores no secrets and performs no network calls. Factor proof verification must happen in a separately audited verifier before an application treats a factor as satisfied. `riskScore` is caller-supplied policy input, not a fraud-detection claim. This package is not a compliance certification or production security control by itself.

## Validation
From the repository root:

```sh
pnpm run check:packages
pnpm vitest run packages/sky-mfa/src/index.test.ts
```
