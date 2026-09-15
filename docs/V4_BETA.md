# SKYCOIN4444 V4 Engineering Beta

V4 is an integration milestone over the strongest existing SKYCOIN4444 beta loops. It is not a claim that every indexed route is production-complete.

## Launch surface

Open `/beta-workspace`. The workspace now renders the V4 command center.

The command center narrows the wider route registry to seven flagship loops:

1. Social & Community
2. SkyGaming
3. SkyLive
4. SkyMarket Commerce
5. SkySchool
6. HopeAI Coach
7. Web3 Evidence Room

Each flagship reuses an existing six-stage evidence journey. A V4 tester pass can be recorded only after all six stages for that flagship are checked. Both the stage checklist and the V4 tester-pass state are browser-local testing aids; they are not usage analytics, security certification, deployment evidence, or production approval.

## Cross-product missions

V4 groups flagships into five outcomes:

- **Connect & create:** Social + Live
- **Learn & act:** SkySchool + HopeAI
- **Play & improve:** Gaming + Social
- **Browse & quote:** Commerce
- **Inspect & verify:** Web3 + SkySchool

These missions are navigation and testing workflows. Completing one does not create a credential, financial record, blockchain transaction, or production-readiness certification.

## Evidence model

V4 deliberately distinguishes different implementation types:

- **Account-backed:** supported records are persisted for an authenticated beta account, such as social or learning progress.
- **Local-persistent:** state is retained in the browser where documented, such as commerce rehearsal state or some gaming state.
- **Networked beta:** a real bounded network path exists, such as direct small-room WebRTC signaling.
- **Deterministic account context:** HopeAI uses rules plus supported account-owned evidence; it does not claim an external model provider.
- **Deterministic simulation:** Web3 rehearses intent validation locally and structurally records that no signing, broadcast, custody, or chain write occurred.

## Hard boundaries

V4 does not claim live payment processing, banking, wallet custody, blockchain signing/broadcast, regulatory approval, identity verification, provider-backed AI where no provider is configured, large-scale streaming infrastructure, or production-scale reliability.

## CI gate

The required `validate` workflow runs `scripts/audit-v4-beta.mjs`. The audit verifies that all seven flagship entry routes are registered, their implementation source files and release contracts exist, the V4 workspace is wired to the command center, and high-risk product limitations remain explicit.

The V4 audit supplements the existing typecheck, lint, credential scan, beta-marker audit, V3 capability audit, unit tests, release/integration tests, production build, and high-severity dependency audit. It is an engineering release gate, not a production certification.
