# SkyAudit (#68)

SkyAudit is a bounded engineering-beta audit-record domain core for SKYCOIN4444. It validates and canonicalizes audit events, derives deterministic record identifiers, and provides metadata redaction helpers suitable for integration contracts and tests.

## Integration contract

Call `createAuditRecord()` with an actor, action, resource, and ISO date-time. The returned record is normalized and deterministic for the same canonical input. `redactAuditMetadata()` should be applied before callers attach potentially sensitive metadata.

## Security and product boundaries

This package is not a durable audit log, SIEM, compliance archive, tamper-proof ledger, authentication system, or production security guarantee. It does not persist records, transmit them, sign them cryptographically, enforce retention, or certify regulatory compliance. Callers remain responsible for authorization, storage, access control, transport security, retention, and incident response.
