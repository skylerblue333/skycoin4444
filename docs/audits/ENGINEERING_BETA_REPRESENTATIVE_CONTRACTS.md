# Engineering Beta Representative Contract Evidence

This document maps the representative domain requirement in Issue #187 to deterministic code that is executed by `pnpm run test:integration` through `tests/release/representative-contracts.test.ts`.

| Required area | Representative implementation | Evidence exercised | Engineering-beta truth boundary |
| --- | --- | --- | --- |
| Education/content | `packages/sky-question-bank` | question validation/grading contract | Local domain logic only; no LMS, instructor, certification, or durable course service is implied. |
| Social/communications | `packages/sky-feed` | normalized `feed.item_published` integration event | No realtime delivery, moderation operation, durable social graph, or provider availability is implied. |
| Finance/payment-planning | `packages/sky-checkout` | deterministic checkout quote contract | Quote/planning only; no payment authorization, banking, custody, settlement, or ledger persistence is performed. |
| AI | `packages/hopeai-agent-runtime` | deterministic agent-plan dependency graph | Local orchestration planning only; no live model/provider inference is performed. |
| Analytics/evaluation | `packages/sky-evaluation` | weighted evaluation result and `skyevaluation.v1` report | Deterministic evaluation/reporting only; no production telemetry warehouse or analytics provider is implied. |
| Web3/domain | `packages/sky-nft-core` | local NFT transfer plan and state transition | The contract explicitly records `chainExecutionPerformed: false`; no custody, signing, smart-contract deployment, or chain finality is implied. |

The existing `tests/release/integration-smoke.test.ts` remains responsible for the canonical cross-product release smoke path. The representative suite supplements it; it does not promote these packages to provider-backed or production status.

## CI enforcement

`pnpm run test:integration` runs `vitest run tests/release`, so both the canonical integration smoke and representative domain contract suite are required by the repository's core CI workflow. Release evidence is valid only after exact-head CI succeeds and the merged default-branch commit is reverified.
