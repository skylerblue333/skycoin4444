# Sky4 DID Credentials

Engineering-beta DID/verifiable-credential validation envelope core tracked by Issue #146.

## Capability

- validates bounded DID strings, credential types, issuance/expiration times and attribute sizes;
- rejects future-issued and expired claims;
- canonicalizes attribute ordering and derives deterministic SHA-256 envelope digests;
- returns immutable-style credential envelopes for downstream integration.

## Integration contract

Import `validateCredentialClaim` and `envelopeCredential` from `src/index.ts`. Callers supply the current time explicitly and own signature/key/resolver policies.

## Security and product boundary

This package does **not** verify a person's real-world identity, resolve DID documents, validate cryptographic signatures, issue government credentials, perform KYC/AML, store credentials, connect to identity networks, or provide compliance/security certification. It is a deterministic claim-validation/envelope library only.
