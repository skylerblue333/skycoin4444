# SkyIdentity — Wave 2 Slot #61

SkyIdentity is an **engineering-beta identity domain core** for assigning stable SKYCOIN4444-local identifiers to caller-supplied subjects. It is a library, not an authentication provider, KYC service, DID network, or proof-of-personhood system.

## Capability

- Normalizes bounded product namespaces and subject identifiers.
- Derives deterministic `skyid_<32 hex>` IDs with SHA-256 domain separation.
- Validates IDs without network access.
- Creates canonical local identity records from caller-supplied timestamps and optional display names.
- Matches a record back to its namespace/subject pair.

## SKYCOIN4444 integration contract

Each platform module can use its product name as the namespace and its existing local identifier as the subject. For example, SkySchool may map `student:42` in namespace `skyschool`; SkyCommunity can map its own member IDs independently. The resulting SkyIdentity ID is stable for the same normalized namespace/subject pair and differs across namespaces.

Consumers must retain their authoritative account/profile data. SkyIdentity does not store records, authenticate users, resolve duplicate humans, or prove that a caller owns a subject identifier.

## Security / privacy boundary

The deterministic ID is derived from caller-supplied identifiers. Do **not** feed secrets, passwords, access tokens, government identifiers, or other sensitive raw values into `deriveIdentityId`; deterministic hashes can enable correlation or guessing when the input space is small. A production deployment that needs unlinkability should use an appropriately protected keyed identifier scheme and documented key lifecycle.

Input validation is intentionally narrow to avoid control characters, HTML-like payloads, whitespace ambiguity, and unbounded values. This package performs no authorization decision.

## Validation

From the repository root:

```sh
pnpm --filter @skycoin/skyidentity test
pnpm run check:packages
pnpm --filter @skycoin/skyidentity format:check
```
