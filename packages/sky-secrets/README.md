# SkySecrets (#69)

SkySecrets is a bounded engineering-beta secret-reference and access-event domain core for SKYCOIN4444. It validates provider-neutral secret references, derives deterministic reference keys, emits metadata-only access-request events, and offers defensive redaction for obvious secret-bearing fields.

## Integration contract

Callers pass a `SecretReference` such as `{ namespace, name, version? }` to `secretReferenceKey()` or `createSecretAccessEvent()`. The resulting `sky.secrets.access.requested.v1` event contains reference metadata only and can be consumed by SkyAudit, observability, or a future authorized secret-manager adapter.

## Security and product boundaries

This package does **not** store, encrypt, rotate, retrieve, transmit, or authorize access to secret values. It is not AWS Secrets Manager, Vault, a KMS, credential broker, HSM, or production secret store. Authentication, authorization, provider credentials, key management, durable audit, access policy, transport security, rotation, and production deployment remain integration responsibilities. Redaction is defense in depth, not a DLP guarantee.
