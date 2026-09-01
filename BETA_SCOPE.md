# SKYCOIN4444 Mission Control Engineering Beta Scope

## Beta purpose

SKYCOIN4444 Mission Control is an **invitation-only engineering beta** for users to explore a curated, clearly labeled set of Skycoin ecosystem capabilities. Its purpose is to validate a small, useful user journey, identify usability and reliability issues, and collect actionable feedback before any broader release.

This document governs the beta release surface. A repository, package, page, workflow, prototype, or historical product record is **not** automatically included in the beta.

## User promise

> Mission Control lets an invited user sign in, understand which selected Skycoin capabilities are available, complete one supported non-financial journey, and submit feedback. Every capability is labeled by its verified availability.

The initial supported journey is:

1. The invited tester opens Mission Control and reviews the capability catalog.
2. The tester signs in only when the deployed authentication/session configuration has passed release verification.
3. The tester creates or reviews a profile only when the deployed persistence, consent, and privacy paths have passed release verification.
4. The tester enters one release-approved, non-financial course or creator workflow.
5. The tester submits product feedback or reports an issue through the release-approved support route.

## Capability-status vocabulary

| Status                | Meaning                                                                                                                                               | Tester expectation                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Available in beta** | The specific route is deployed, release-approved, and verified in the current beta environment.                                                       | The tester may use it and report defects.                                                             |
| **Engineering beta**  | A first-party integration path has been verified in source control or CI, but its deployed external dependencies are not yet independently confirmed. | The capability may be labeled or demonstrated, but is not promised as a live provider-backed service. |
| **Planned**           | The capability is represented in the product direction or catalog, but is not available for tester use.                                               | No action or data submission should be requested.                                                     |
| **Unavailable**       | The capability is intentionally excluded or its required dependencies are not verified.                                                               | The capability is hidden, gated, or clearly marked unavailable.                                       |

A capability may be called **provider-backed** only after its actual production-like provider configuration, permissions, success path, failure behavior, monitoring, and release evidence have been independently verified.

## Included initial beta surfaces

| Surface                                             | Intended beta status | Release condition                                                                                                                                 |
| --------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mission Control home and capability discovery       | Available in beta    | Route-level smoke test and truthful availability labels pass.                                                                                     |
| Profile and account experience                      | Conditional          | Authentication, session handling, consent, privacy notice, persistence, and support/deletion route are verified in the deployed beta environment. |
| One curated course or creator workflow              | Conditional          | A single end-to-end non-financial workflow is release-approved and has an assigned owner, test evidence, and feedback path.                       |
| Documentation, known issues, and capability catalog | Available in beta    | Public/internal links resolve and match the deployed release.                                                                                     |
| Feedback and support intake                         | Available in beta    | The destination is monitored and an owner is assigned for triage.                                                                                 |

## Explicitly excluded from the initial public beta

The following are **not** part of the initial invitation-only Mission Control beta unless a separate release record proves the required provider, security, operational, and legal conditions:

- payments, banking, escrow, financial settlement, accounting transfers, trading, lending, borrowing, investing, or financial advice;
- wallet custody, seed/key handling, token issuance, token transfer, NFT transfer, blockchain transaction execution, cross-chain bridges, staking, validator/mining operations, or governance execution;
- identity proofing, KYC/AML decisions, credit or eligibility decisions, and any regulated compliance assurance;
- claims of audited smart contracts, production-grade security, production availability, or regulatory approval;
- unverified third-party AI, OAuth, email, SMS, push notification, storage, analytics, cloud, or blockchain-provider behavior;
- experimental, placeholder, mocked, “coming soon,” or unavailable routes that have not been explicitly approved for beta use.

No fabricated balances, transactions, users, AI output, chain activity, identity-verification result, provider delivery, or persistence confirmation may be used to suggest that an excluded or unavailable capability is operating.

## Beta admission criteria

A route can be labeled **Available in beta** only when all of the following are recorded in its release evidence:

| Criterion              | Required evidence                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| Canonical source       | The source package, feature, and commit SHA are identified.                                                  |
| Automated verification | The exact release commit has successful required checks.                                                     |
| Route verification     | A human-performed beta-environment smoke test is recorded.                                                   |
| Dependency truth       | External dependencies are listed and verified or the route fails closed as unavailable.                      |
| Data controls          | Data sensitivity, persistence behavior, consent/privacy requirement, and deletion/support path are recorded. |
| Operations             | A named owner, logging/error path, support route, and rollback action exist.                                 |
| User communication     | Capability label, known limitations, and feedback route are visible to the tester.                           |

## Tester operations

The beta starts with a small consent-based cohort. Every invitation must identify the beta as pre-release software, provide a feedback and support destination, link to known limitations, and avoid financial or production-security assurances. Feedback and defects are triaged at least weekly, with high-severity privacy, authorization, data-loss, or security reports handled immediately under `SECURITY.md`.

## Expansion and rollback

New product domains are added one at a time. A domain must have an owner, canonical implementation, release evidence, capability label, test evidence, deployment verification, and a rollback plan before being exposed.

If the core journey is unavailable, data integrity/privacy is in doubt, an authorization issue occurs, a release check fails, or a provider-backed dependency behaves unexpectedly, remove the affected route from the beta surface or mark it unavailable until the issue is resolved and reverified.

## Relationship to other repository material

The canonical Mission Control beta application is this repository. External repositories and internal packages may act as source libraries, reference implementations, experiments, or historical evidence; they are not independently deployable beta services unless separately named in a release record.

See [`catalogs/mission-control-beta.json`](catalogs/mission-control-beta.json) for the machine-readable surface register and [`BETA_RELEASE_CHECKLIST.md`](BETA_RELEASE_CHECKLIST.md) for the release procedure.
