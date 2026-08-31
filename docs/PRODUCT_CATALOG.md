# Product Catalog and Integration Status

## Purpose

This catalog describes product artifacts by **current engineering status**, not by marketing name or historical slot completion alone. A merged product slot proves a canonical engineering artifact was completed under its ledger; it does not automatically prove production deployment or end-to-end runtime integration.

## Maturity labels

- **Domain core** — independently testable library logic, validator, planner, registry, or bounded state machine.
- **Integration contract** — documented/tested interface between products or adapters.
- **Engineering-beta integrated** — participates in a verified cross-product local/CI path.
- **Provider-backed verified** — requires current evidence of a real external provider/deployment. This catalog does not assume this status without separate evidence.

## Numbered product programs

### Wave 1 — slots #1–#60

Issue #27 is the historical coordination ledger for the first 60 canonical slots. The program includes original products plus later collision/recovery reconciliation. Historical slot completion should therefore be treated as provenance evidence to audit, not as a claim that every slot has equal implementation depth or production maturity.

### Wave 2 — slots #61–#168

Issue #29 is the historical coordination ledger for the 108 Wave-2 slots. These products were implemented across identity/security, finance, AI, social, education, business, commerce, Web3, platform infrastructure, and developer/integration domains. Many are bounded domain cores with tests and explicit limitations.

The independent master audit in Issue #185 is the current place to grade implementation depth, CI integrity, integration, documentation, and post-merge regression status without inheriting old completion grades.

## Current flagship integration map

### Security and identity

| Product area | Current status | Notes |
| --- | --- | --- |
| SkyIdentity | Engineering-beta integrated | Bounded identity domain; upstream of auth path. |
| SkyAuth | Engineering-beta integrated | Session/auth policy boundary; not a hosted IdP. |
| SkyMFA | Engineering-beta integrated | Assurance policy boundary; no live MFA provider implied. |
| SkyPermissions | Engineering-beta integrated | Fail-closed authorization contract. |
| SkyAudit | Engineering-beta integrated | Structured audit-domain events; not production SIEM/compliance logging. |

### Education and credentials

| Product area | Current status | Notes |
| --- | --- | --- |
| Course/education adapter | Integration contract | Narrow adapter in the first verified vertical. |
| SkyCredentials | Engineering-beta integrated | Bounded credential-domain behavior; no external issuance network implied. |

### Finance

| Product area | Current status | Notes |
| --- | --- | --- |
| SkyPayments | Engineering-beta integrated planning core | Validation/planning only unless provider settlement is separately verified. |
| Ledger adapter | Integration contract | Bounded handoff; not proof of durable production ledger or settlement. |
| Billing/subscriptions/checkout/treasury/accounting/rewards/etc. | Primarily domain cores | Product-specific tests/contracts exist; runtime/provider status must be verified separately. |

### Communications and social

Messaging, presence, feed, groups, events, comments, reactions, channels, creator/media/streaming, notifications, talent/jobs and related packages are primarily domain cores or integration contracts unless a specific server/client path is independently verified. Package or UI existence is not evidence of durable delivery, realtime infrastructure, moderation operations, or production social scale.

### AI and knowledge

Search, recommendations, knowledge, agents, prompt/model registry, model gateway, vector/memory, voice/translate/document/vision/evaluation and HopeAI-related packages provide engineering artifacts at varying levels of domain-core and adapter maturity. They do not prove live model-provider connectivity, production inference capacity, model safety certification, or durable vector/memory services.

### Web3

DID, Web3 credentials, governance, staking, token registry, NFT, chain monitor and explorer packages are bounded domain artifacts unless separately integrated. They do not prove deployed smart contracts, custody, transaction execution, validator operation, or audited chain security.

### Platform and developer infrastructure

Observability, service registry, feature flags, config, scheduler, queue, storage, cache, CDN policy, status/health, backup/recovery controls, developer hub, SDK/webhook/integration hubs and API control-plane packages represent engineering-domain cores and contracts. They do not prove production cloud resources, durable queues/storage, operational monitoring, backups, recovery drills, or public API availability.

## Canonical-vs-legacy rule

Use `docs/CANONICAL_ARCHITECTURE_INVENTORY.md` to determine whether a surface is authoritative, historical, generated, duplicate, or a cleanup candidate. Do not infer production maturity from page count, branch count, repository count, or product naming.

## Updating this catalog

Promote a product to a stronger maturity label only with direct evidence: current implementation review, tests, exact-head CI where applicable, default-branch presence, integration path, provider/deployment evidence if claimed, and documented limitations.
