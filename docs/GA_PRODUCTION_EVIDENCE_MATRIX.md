# SKYCOIN4444 GA Production Evidence Matrix

**Assessment checkpoint:** `41316ef`  
**Assessment date:** 2026-08-16  
**Release decision:** **GA NOT YET AUTHORIZED**

This matrix distinguishes repository evidence from external production evidence. A row is not complete because configuration files exist or a page renders. Each row requires an owner, verifiable artifact, rollback plan, and explicit acceptance result.

| Workstream | Owner | Required evidence | Rollback plan | Acceptance result | Status |
|---|---|---|---|---|---|
| Dependabot #121 | Repository owner / security owner | GitHub alert #121 for esbuild dismissed as remediated; current lockfile resolves esbuild 0.25.12; local audit clean | Reopen the alert and revert only if a verified regression is found | Owner confirmation recorded in GitHub Security and `docs/dependabot-121-evidence.md` | **Complete** |
| Staging database | Backend / infrastructure owner | Isolated staging database, migration output, connection-limit configuration, least-privilege credentials, authorization tests, and sanitized seed policy | Restore the pre-migration snapshot and disable staging traffic | Migration and authorization evidence reviewed and accepted | **Not verified** |
| Staging OAuth | Identity owner | Client registration, exact redirect URIs, state validation, secure cookie/session behavior, login/logout browser evidence | Disable staging client and revoke credentials; restore prior identity configuration | Login and logout evidence accepted without production secrets in the repository | **Not verified** |
| AWS/EC2 deployment | Infrastructure owner | Deployment transcript, immutable artifact or commit, health check, process supervision, secret injection, capacity result, and rollback rehearsal | Revert to last known-good artifact and verify health endpoint | Deployment and rollback drill accepted | **Not verified** |
| DNS/TLS/reverse proxy | Infrastructure / DNS owner | Production hostname, DNS records, certificate chain and renewal, HTTPS redirect, security headers, and edge-to-origin test | Restore prior DNS target or maintenance response and revoke invalid certificate | External connectivity and TLS evidence accepted | **Not verified** |
| Monitoring and alerting | Operations owner | Structured error events, uptime checks, database/API alerts, redaction review, escalation path, and on-call acknowledgement | Disable noisy alert route while preserving error collection; restore prior thresholds | Alert delivery and redaction evidence accepted | **Not verified** |
| Backup and restore | Database / operations owner | Encrypted backup schedule, retention policy, restore transcript, recovery objectives, and integrity verification | Keep source environment unchanged; restore into isolated recovery target | Restore drill meets documented recovery objectives | **Not verified** |
| Registration and login | Identity / QA owner | Browser evidence for registration or provider onboarding, login, invalid-session failure, secure cookie behavior, and logout | Disable the staging identity client and return to the previous auth configuration | End-to-end workflow accepted | **Incomplete** |
| Profile and account operations | Backend / QA owner | Authenticated read/update tests, validation failures, persistence evidence, and authorization boundary tests | Revert staged schema/data changes and disable unsupported mutations | Workflow accepted with no cross-account access | **Incomplete** |
| Wallet ledger | Backend / QA owner | Account-scoped database read/write evidence, transaction authorization tests, migration evidence, and truthful non-custody labeling | Restore database snapshot and disable ledger mutations | Ledger workflow accepted; no on-chain custody claims | **Incomplete** |
| AI unavailable state | Product / QA owner | Regression evidence that unsupported AI calls return explicit unavailable states and no fake success | Revert UI/API change and keep feature gated | Truthful unavailable-state contract accepted | **Complete for current boundary** |
| Education | Product / backend / QA owner | Course persistence, progress, quiz/certification rules, authorization, and representative integration tests | Disable incomplete education mutations and restore prior data snapshot | Education workflow accepted | **Not verified** |
| Admin authorization | Security / backend owner | Non-admin denial, admin allow, mutation authorization, audit logging, and browser evidence; automated router evidence: `docs/admin-authorization-evidence.md` | Revert role/middleware change and disable admin surface | Router boundary partially accepted; full acceptance requires audit logging and browser evidence | **Partially complete** |
| Representative integrations | Integration owner | Contract fixtures or staging calls, timeout/error handling, secrets review, rate-limit behavior, and retry evidence | Disable integration feature and expose truthful unavailable state | Integration acceptance recorded per provider | **Not verified** |

## Evidence rules

Production secrets, private keys, seed phrases, access tokens, and personally identifying data must not be committed or placed in screenshots, logs, or test fixtures. A local `pnpm audit` result does not replace owner-level GitHub Security confirmation. A successful build does not establish production database, identity, deployment, networking, monitoring, or backup evidence.

The release remains a **code-green stabilization checkpoint** until every no-go row has a named owner, linked evidence, tested rollback procedure, and explicit acceptance result.
