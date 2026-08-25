# SkyPrivacy — Wave 2 #67 (Lane 07)

SkyPrivacy is an **engineering-beta privacy workflow domain core** for SKYCOIN4444. It validates privacy request metadata, creates deterministic export manifests, and enforces a small export/delete request state machine.

## Capabilities

- validates subject/request identifiers and bounded optional reasons
- normalizes bounded export data categories deterministically
- models `requested -> approved/rejected -> completed` workflow transitions
- emits a small `PrivacyIntegrationEvent` contract suitable for a future SkyAudit/SkyNotifications integration

## Integration contract

`toPrivacyIntegrationEvent()` exposes request/status metadata only. Consumers can map `subjectId` to SkyIdentity and route status changes to audit or notification layers without importing persistence or transport concerns.

## Security and truth boundaries

This package does **not** read production databases, export user data, erase records, verify legal identity, prove GDPR/CCPA compliance, notify external processors, or perform irreversible deletion. Applications must implement authorization, retention/legal-hold checks, durable persistence, processor coordination, and operator approval around this domain core.
