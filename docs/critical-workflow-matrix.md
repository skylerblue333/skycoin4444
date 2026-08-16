# SKYCOIN4444 Critical Workflow Matrix

**Assessment checkpoint:** `bae2b76`  
**Assessment date:** 2026-08-16  
**Decision rule:** A workflow is not GA-ready because a page renders. It requires executable evidence for authentication, authorization, validation, persistence, failure handling, and required external integrations.

| Workflow | Classification | Verified evidence | Remaining limitation or blocker |
|---|---|---|---|
| OAuth login and session creation | INTEGRATION-REQUIRED | OAuth callback validates state, obtains user information, creates a session token, and sets a secure session cookie in `server/_core/oauth.ts`. | Production OAuth configuration, redirect validation, cookie/session behavior, and end-to-end login evidence are not verified in this environment. |
| Logout | INTEGRATION-REQUIRED | `server/auth.logout.test.ts` verifies the session cookie is cleared with secure cookie options. | Full browser login/logout lifecycle and production identity-provider evidence remain incomplete. |
| Admin authorization | GA-READY for procedure boundary | Admin router endpoints now use `adminProcedure`; regression tests verify non-admin rejection and admin access in `server/admin.authorization.test.ts`. | Admin data and mutations remain unavailable/empty where backend integrations are not implemented; full admin workflow acceptance is incomplete. |
| Account-scoped wallet ledger reads | INTEGRATION-REQUIRED | `wallet.getBalance`, `wallet.getConnections`, and transaction-history procedures read records scoped to `ctx.user.id`; Wallet UI labels this as an account ledger. | Production database, migration, backup/restore, and representative authorization evidence are not verified. This is not on-chain custody. |
| External wallet connection and signing | TRUTHFULLY-GATED | Connect, send, on-chain balance, gas, signing, broadcasting, and wallet registration procedures return explicit unavailable states. | Verified provider, signer, RPC, network validation, transaction reconciliation, and custody infrastructure are absent. |
| Exchange, order book, swap, and trading | TRUTHFULLY-GATED | UI surfaces and mutations are gated or return explicit unavailable states; synthetic DEX data and unsupported controls were removed. | No verified exchange, market-data, signer, execution, settlement, or cancellation integration. |
| Portfolio, allocation, staking, mining, and DeFi calculations | TRUTHFULLY-GATED | Unsupported dashboards, fabricated metrics, hard-coded rates, and simulated financial activity were gated or removed. | No authoritative market, chain, custody, accounting, or audited economics integration. |
| AI chat and generation | TRUTHFULLY-GATED | AI router responses explicitly return unavailable results; unsupported HopeAI marketing claims were gated. | Verified model provider configuration, prompt/data controls, output validation, usage controls, and production error evidence are absent. |
| Education pages | INTEGRATION-REQUIRED | Education routes exist and render user-facing surfaces. | Course persistence, progress, certification, analytics, and representative workflow tests require verification before GA claims. |
| Profile and social account operations | INTEGRATION-REQUIRED | Protected procedures and account-scoped database patterns exist; unsupported mutations return unavailable states where applicable. | Full profile, upload, social mutation, moderation, and persistence workflow evidence is incomplete. |
| Database persistence and migrations | BLOCKED | Drizzle schema and account-scoped query patterns exist; local typecheck/build pass. | Real production database, migration execution, connection limits, backup policy, restore drill, and authorization tests are not verified. |
| Observability and incident response | BLOCKED | Synthetic observability surfaces were removed to prevent false production claims. | No verified production logs, metrics, traces, uptime checks, alerting, redaction review, or on-call evidence. |

## Current interpretation

The repository is **code-green**: strict TypeScript, local production build, available tests, diff hygiene, and Git synchronization pass. That does not make the product fully GA-authorized. The matrix intentionally leaves external-infrastructure workflows as integration-required or blocked and keeps unsupported financial, custody, exchange, AI, and telemetry claims truthfully gated.
