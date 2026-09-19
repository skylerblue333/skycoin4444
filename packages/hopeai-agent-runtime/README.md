# HopeAI Agent Runtime

Engineering-beta deterministic agent orchestration/planning core tracked by Issue #146.

## Capability

- validates bounded agent/step IDs, supported step kinds, step inputs and dependency arrays;
- rejects malformed runtime objects, duplicate IDs, duplicate dependencies and forward/unknown dependencies with controlled errors;
- builds deterministic SHA-256 plan IDs from ordered agent steps;
- verifies plan integrity again before scheduling dependency-ready work;
- validates the completed-step collection before evaluating ready steps.

## Integration contract

Import `buildAgentPlan` and `nextReadySteps` from `src/index.ts`. The caller owns model/tool execution, authorization, persistence and retries. Runtime data should still be treated as untrusted at process/API boundaries; this package validates its own public inputs and fails closed when a plan has been tampered with.

## Product boundary

This package does **not** connect to an AI model, execute tools, browse the web, access user accounts, persist memory, guarantee autonomous outcomes, make safety decisions, or operate a production agent service. It is a deterministic orchestration/planning library only.
