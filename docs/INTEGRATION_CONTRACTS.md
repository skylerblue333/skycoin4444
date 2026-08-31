# Integration Contracts

## Purpose

This document records the current engineering-beta cross-product contract model. It distinguishes tested local/domain integration from live provider-backed capabilities.

## Canonical vertical

The first verified cross-product vertical follows:

`SkyIdentity -> SkyAuth -> SkyMFA -> SkyPermissions -> course adapter -> SkyCredentials -> SkyPayments planning -> ledger adapter -> notification adapter -> SkyAudit`

This is an engineering-beta integration path. It is not evidence of a live identity provider, payment processor, durable ledger, notification service, or production audit platform.

## Fail-closed rules

The integration must stop rather than silently continue when:

- identity subject validation fails;
- authentication/session policy rejects the claim;
- MFA policy rejects the required assurance level;
- permission/authorization checks deny the action;
- financial planning input is invalid;
- a security-sensitive adapter cannot establish its required preconditions.

A fallback may report `unavailable`, `denied`, or another explicit bounded state. It must not fabricate successful authentication, authorization, settlement, delivery, or persistence.

## Contract responsibilities

### Identity -> authentication

Identity output provides a bounded subject identifier and validated local identity shape. Authentication is responsible for session/auth policy; identity package existence is not authentication proof.

### Authentication -> MFA

Authentication establishes the bounded principal/session context. MFA is responsible for evaluating additional assurance requirements. Neither stage implies an external IdP or cryptographic token verifier unless such a provider is separately wired and verified.

### MFA -> permissions

Permissions receive only an accepted principal/assurance context. Authorization decisions must be explicit and deterministic for the tested domain contract.

### Permissions -> course/credentials

Education/course adapters must not bypass rejected security gates. Credentials represent bounded engineering-beta credential-domain behavior unless external issuance/verification is independently implemented.

### Credentials -> payment planning

Payment modules may validate and plan intents. Planning is not authorization by a payment processor, settlement, banking, custody, or money transmission.

### Payment planning -> ledger adapter

Ledger adapters represent bounded accounting/event handoff. Unless durable persistence is independently verified, they must not be described as a production ledger or settlement record.

### Ledger -> notification adapter

Notification adapters represent bounded delivery intent/event handoff. They do not prove email, SMS, push, webhook, or other external delivery occurred.

### All stages -> audit

Audit receives structured events about the tested control path. Local/domain audit records are not a substitute for tamper-evident production logging, retention policy, SIEM integration, or compliance evidence.

## External adapter behavior

When an external dependency is unavailable:

1. validate configuration before use;
2. return an explicit unavailable/failure state;
3. avoid synthetic success values;
4. avoid leaking credentials or provider error details;
5. preserve fail-closed security/financial behavior;
6. cover the failure mode with tests where practical.

## Change control

Changes to integration contracts should include targeted tests and must pass exact-head CI. If a contract changes a security, financial, persistence, or provider boundary, document the new assumption and its limitations in the same PR.
