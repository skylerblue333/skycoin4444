# Skycoin Ecosystem Beta Area Readiness Matrix

**Purpose.** This matrix converts the canonical 30-area registry into a staged beta delivery contract. A registry status describes implementation intent; it does not prove that a deployed service is available. Promotion requires the area-specific evidence described below plus the shared release checklist.

## Promotion vocabulary

| Target state                     | Meaning                                                                                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Available after verification** | The area may be exposed to invited testers after its deployed route, data path, owner, monitoring, and release evidence pass.                                           |
| **Controlled test beta**         | The area may be exposed only with explicit test-mode labeling, synthetic or test data, bounded permissions, and no real settlement, custody, or live-chain side effect. |
| **Integration beta**             | The area is wired into the canonical application but still needs a named end-to-end route, deployment evidence, or provider verification.                               |
| **Gated / unavailable**          | The area remains hidden or fail-closed until the independent security, provider, operational, legal, and deployment gates pass.                                         |

## Area-by-area plan

|   # | Area                        | Domain     | Audited registry status | Beta target                  | Required acceptance gate                                                                                                                         |
| --: | --------------------------- | ---------- | ----------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
|   1 | Core Platform               | Platform   | Implemented             | Available after verification | Production build, health route, configuration validation, deployment rollback, and owner evidence.                                               |
|   2 | Identity and Authentication | Identity   | Integrating             | Integration beta             | OAuth/IdP configuration, secure sessions, account recovery, abuse controls, and environment smoke test.                                          |
|   3 | Profiles                    | Identity   | Implemented             | Available after verification | Persistence, privacy notice, consent, validation, deletion/support path, and authorization tests.                                                |
|   4 | Settings                    | Identity   | Implemented             | Available after verification | Per-user authorization, safe defaults, audit events, and persistence/failure tests.                                                              |
|   5 | Notifications               | Platform   | Implemented             | Controlled test beta         | One monitored delivery provider or in-app-only mode, opt-in controls, retry/failure handling, and data minimization.                             |
|   6 | Admin Controls              | Security   | Integrating             | Gated / unavailable          | Role separation, least privilege, MFA for privileged users, immutable audit trail, and break-glass procedure.                                    |
|   7 | Wallet                      | Financial  | Integrating             | Controlled test beta         | Testnet or mock-only mode first; no custody or seed handling; authorization, signing boundary, recovery, and security review.                    |
|   8 | Portfolio Management        | Financial  | Implemented             | Controlled test beta         | Read-only/test-data mode, explicit non-advice labeling, data provenance, access controls, and reconciliation tests.                              |
|   9 | Live Market Data            | Financial  | Blocked                 | Gated / unavailable          | Licensed provider, freshness/quality checks, outage behavior, rate limits, cost owner, and legal review.                                         |
|  10 | Exchange                    | Financial  | Blocked                 | Gated / unavailable          | No live trading in initial beta; later requires provider, suitability, transaction authorization, limits, audit, incident, and legal evidence.   |
|  11 | NFT Gallery                 | Blockchain | Integrating             | Controlled test beta         | Read-only indexed/testnet mode, provenance display, content safety, no transfer or custody, and provider outage handling.                        |
|  12 | Mining                      | Blockchain | Blocked                 | Gated / unavailable          | No production mining or resource use in beta; later requires explicit operator consent, cost controls, security review, and monitoring.          |
|  13 | Skychain Protocol           | Blockchain | Integrating             | Controlled test beta         | Local/testnet node, deterministic fixtures, protocol compatibility tests, no mainnet side effects, and rollback/recovery evidence.               |
|  14 | Cross-chain Bridge          | Blockchain | Blocked                 | Gated / unavailable          | Independent protocol/security audit, testnet-only rehearsals, replay protection, limits, monitoring, incident pause, and legal review.           |
|  15 | HopeAI                      | AI         | Integrating             | Controlled test beta         | Provider/model allowlist, prompt/data boundary, redaction, abuse controls, cost/rate limits, evaluation set, and explicit output limitations.    |
|  16 | ShadowChat                  | AI         | Integrating             | Controlled test beta         | End-to-end privacy threat model, retention controls, abuse reporting, provider mode labels, and no claim of anonymity beyond evidence.           |
|  17 | AI Control Center           | AI         | Integrating             | Integration beta             | Model registry, permission boundaries, audit events, rate/cost controls, safe failure, and operator approval for provider activation.            |
|  18 | AI Marketplace              | AI         | Planned                 | Gated / unavailable          | Vendor review, content safety, billing isolation, provider verification, moderation, dispute handling, and terms/privacy review.                 |
|  19 | SkySchool                   | Education  | Integrating             | Available after verification | One complete course journey, progress persistence, accessibility, content owner, completion/failure tests, and support route.                    |
|  20 | Courses and Curriculum      | Education  | Implemented             | Available after verification | Versioned content, enrollment authorization, progress integrity, content licensing, and one deployed smoke-tested course.                        |
|  21 | Quizzes                     | Education  | Implemented             | Available after verification | Deterministic scoring, attempt limits, accessibility, answer privacy, and progress integration tests.                                            |
|  22 | Certifications              | Education  | Planned                 | Integration beta             | Issuance policy, identity binding, revocation, verification endpoint, content owner, and no external credential-network claim.                   |
|  23 | Community                   | Community  | Planned                 | Integration beta             | Moderation owner, reporting/blocking, privacy controls, rate limits, data retention, and abuse response.                                         |
|  24 | Social Graph                | Community  | Planned                 | Gated / unavailable          | Consent, discoverability controls, deletion propagation, anti-abuse design, privacy threat model, and operational moderation.                    |
|  25 | Creator Tools               | Content    | Planned                 | Integration beta             | Draft/publish permissions, content safety, asset ownership, storage limits, versioning, and takedown/support route.                              |
|  26 | Digital Marketplace         | Commerce   | Integrating             | Controlled test beta         | Catalog/test checkout only, no real settlement, inventory/order integrity, vendor controls, and refund/complaint path.                           |
|  27 | Payments                    | Commerce   | Blocked                 | Gated / unavailable          | Provider and jurisdiction review, tokenization, authorization, settlement/reconciliation, fraud controls, refunds, audit, and incident response. |
|  28 | Analytics                   | Data       | Planned                 | Available after verification | Consent/legal basis, minimization, retention, access controls, aggregation, deletion, and dashboard correctness tests.                           |
|  29 | Security and Compliance     | Security   | Integrating             | Available after verification | Threat model, secret controls, dependency scanning, incident runbook, vulnerability intake, and evidence ownership.                              |
|  30 | Observability               | Operations | Planned                 | Available after verification | Structured logs, metrics, traces/errors, redaction, alert thresholds, ownership, retention, and recovery drill.                                  |

## Shared dependency order

The first release wave is **Core Platform, Identity and Authentication, Profiles, Settings, Security and Compliance, Observability, Courses and Curriculum, Quizzes, and one SkySchool journey**. These areas form the smallest coherent non-financial beta and provide the identity, data, content, and operational evidence required by later domains.

The second release wave is **Notifications, Creator Tools, Community, AI Control Center, HopeAI, ShadowChat, Portfolio Management, NFT Gallery, Skychain Protocol, and Digital Marketplace**, but only in controlled test or integration mode until each area has its own evidence record. These areas must not be promoted merely because a package, page, or adapter exists.

The third release wave is **Certifications, Social Graph, AI Marketplace, Live Market Data, Exchange, Payments, Wallet, Mining, and Cross-chain Bridge**. Several remain gated or unavailable even after the first two waves because their risk is dominated by external providers, custody, regulated activity, mainnet effects, or independent security review. Their implementation should begin with fixtures, testnet, read-only, or dry-run contracts—not live side effects.

## Area release record

Every area promotion must record the repository and commit, canonical route/package, owner, current integration mode (`live`, `test`, or `unavailable`), provider/dependency evidence, data classification, automated checks, deployed smoke-test result, known limitations, monitoring, rollback action, and the date of review. The area registry and this matrix must be updated together whenever a status changes.

## Non-negotiable beta boundary

No beta label may imply that the system has live financial settlement, custody, token transfer, blockchain execution, mainnet bridge operation, mining, regulated identity decisions, audited smart contracts, production security certification, or uninterrupted provider availability unless the corresponding independent evidence is attached to the release record.
