# SKYCOIN4444 Mission Control Beta Release Checklist

Use this checklist for every invitation-only engineering-beta release. A completed check must link to contemporaneous evidence; a previous green run, an old tag, a branch name, or a package’s existence is not sufficient release evidence.

## 1. Scope and ownership

| Check                                                                                                                                      | Required evidence                                            | Owner                       | Complete |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------- | -------- |
| The release identifies one exact commit SHA on `main`.                                                                                     | Commit URL and SHA.                                          | Release owner               | [ ]      |
| The selected tester journey matches `BETA_SCOPE.md`.                                                                                       | Release note naming the durable activation journey.          | Product owner               | [ ]      |
| All presented capabilities match `catalogs/mission-control-beta.json`.                                                                     | Catalog review.                                              | Release owner               | [ ]      |
| Excluded financial, custody, live Web3, identity-proofing, and unverified provider capabilities are hidden, gated, or clearly unavailable. | Route review and screenshots/test record.                    | Product and security owners | [ ]      |
| A release owner and a beta-operations owner are named.                                                                                     | Release note.                                                | Product owner               | [ ]      |

## 2. Source and CI verification

| Check                                                                                           | Required evidence                                                        | Owner             | Complete |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------- | -------- |
| Dependencies install using the repository lockfile.                                             | Successful `pnpm install --frozen-lockfile` record.                      | Engineering owner | [ ]      |
| Type checking succeeds.                                                                         | Successful `pnpm run check` and `pnpm run check:packages` record.        | Engineering owner | [ ]      |
| Linting and formatting checks succeed.                                                          | Successful `pnpm run lint` and `pnpm run format:check` record.           | Engineering owner | [ ]      |
| Credential-pattern and beta-marker checks succeed.                                              | Successful `pnpm run check:secrets` and `pnpm run audit:markers` record. | Security owner    | [ ]      |
| Unit, package, and engineering-beta integration tests succeed.                                  | Successful `pnpm test` and `pnpm run test:integration` record.           | Engineering owner | [ ]      |
| Production build succeeds.                                                                      | Successful `pnpm run build` record.                                      | Engineering owner | [ ]      |
| High-severity production dependency audit succeeds.                                             | Successful `pnpm audit --prod --audit-level high` record.                | Security owner    | [ ]      |
| The canonical GitHub CI run is successful for the exact release commit.                         | CI run URL with matching SHA.                                            | Release owner     | [ ]      |
| A newly generated immutable engineering-beta RC tag resolves to the exact successful CI commit. | Tag URL and resolved SHA.                                                | Release owner     | [ ]      |

## 3. Environment and dependency verification

| Check                                                                                                                                                   | Required evidence                                                 | Owner                           | Complete |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------- | -------- |
| The beta environment name, URL, deployment time, and release commit are recorded.                                                                       | Deployment record.                                                | Release owner                   | [ ]      |
| Configuration contains no development-only or fabricated-success settings.                                                                              | Configuration review; no secret values recorded in release notes. | Engineering and security owners | [ ]      |
| Authentication/session behavior is verified, or the account/profile route remains unavailable.                                                          | Smoke-test record.                                                | Identity owner                  | [ ]      |
| Persistence, migrations, backups, consent, privacy notice, self-data export, and deletion-request/support behavior are verified before accepting user data. | Deployment and operational record; deletion requests must not be described as completed without verified purge evidence. | Data owner | [ ] |
| Every enabled external provider is configured, least-privilege reviewed, tested for success/failure, and monitored; otherwise its route is unavailable. | Provider verification record.                                     | Integration owner               | [ ]      |
| Logs, error reporting, and an on-call or response owner are recorded.                                                                                   | Operations record.                                                | Beta operations owner           | [ ]      |
| Both runtime and beta readiness endpoints report required dependencies ready on the exact deployed release.                                             | `/api/runtime/ready` and `/api/beta/readiness` records with matching release SHA/context. | Operations owner | [ ] |
| Deployment termination grace period accommodates configured HTTP and resource shutdown bounds.                                                           | Platform configuration and controlled termination record. | Operations owner | [ ] |
| Database pool connection limit × maximum application replicas fits safely within the managed database connection quota.                                    | Managed DB quota, replica ceiling, configured pool limit, and sizing calculation. | Data/operations owner | [ ] |
| Database pool queue limit, connect timeout, idle timeout, and non-secret runtime diagnostics are reviewed on the deployed release.                         | Deployment config plus `/api/runtime/database-pool` record. | Operations owner | [ ] |
| If the internal event dispatcher is enabled, the dead-letter queue is reviewed and any manual replay is tied to an administrator audit record.            | Metadata-only dead-letter review plus audit evidence for each replay, if applicable. | Operations owner | [ ] |

## 4. Route-level beta smoke test

| Check                                               | Required result                                                                                                   | Owner                     | Complete |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------- | -------- |
| Mission Control opens successfully.                 | The catalog renders and displays truthful availability labels.                                                    | QA owner                  | [ ]      |
| A tester can navigate only to approved beta routes. | Excluded routes are not mistaken for live capabilities.                                                           | QA owner                  | [ ]      |
| Approved account/profile flow behaves correctly.    | Works only if the deployed identity/persistence conditions are verified; otherwise unavailable state is explicit. | QA owner                  | [ ]      |
| Durable activation journey completes.               | Profile, one lesson, one social post, and feedback persist for the invited account and remain visible after refresh/re-authentication. | QA owner | [ ] |
| Feedback destination works.                         | A submitted test item reaches the monitored triage destination.                                                   | Beta operations owner     | [ ]      |
| Failure handling is truthful.                       | A simulated unavailable dependency is reported as unavailable, not as a successful service.                       | QA and engineering owners | [ ]      |

## 5. Tester operations and communications

| Check                                                                                                                        | Required evidence                   | Owner                       | Complete |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------- | -------- |
| Invitations identify the product as engineering-beta software.                                                               | Invitation template/review.         | Beta operations owner       | [ ]      |
| Testers receive support, feedback, known-issues, privacy, and security-reporting links.                                      | Invitation and landing-page review. | Beta operations owner       | [ ]      |
| The feedback destination has an owner and review cadence.                                                                    | Triage schedule.                    | Beta operations owner       | [ ]      |
| The release notes distinguish available capabilities from engineering-beta, planned, and unavailable areas.                  | Release notes.                      | Release owner               | [ ]      |
| No security, financial, compliance, custody, or production-availability claim exceeds the evidence for the deployed release. | Product/security review.            | Product and security owners | [ ]      |

## 6. Rollback readiness

| Check                                                                                                                            | Required evidence                           | Owner                          | Complete |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------ | -------- |
| The immediately prior stable deployment/commit is identified.                                                                    | Rollback reference.                         | Release owner                  | [ ]      |
| The rollback action and responsible operator are documented.                                                                     | Runbook link.                               | Operations owner               | [ ]      |
| High-severity authorization, privacy, data-loss, security, or provider incidents have a route-removal or service-disable action. | Incident/feature-flag or deployment action. | Security and operations owners | [ ]      |
| The known-issues list is current at invitation time.                                                                             | Release note timestamp.                     | Beta operations owner          | [ ]      |

## Release decision

The beta release may proceed only when every applicable check is complete and the remaining unavailable conditions are prominently communicated. If any required external dependency, data control, security boundary, or user journey cannot be verified, mark the affected capability **Unavailable** and keep it out of the tester path.
