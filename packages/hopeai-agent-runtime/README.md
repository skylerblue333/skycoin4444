# HopeAI Agent Runtime

Engineering-beta deterministic agent orchestration/planning core tracked by Issue #146.

## Capability

- validates bounded agent/step IDs and step inputs;
- rejects duplicate IDs and forward/unknown dependencies;
- builds deterministic SHA-256 plan IDs from ordered agent steps;
- returns dependency-ready next steps from an explicit completed-step set.

## Integration contract

Import `buildAgentPlan` and `nextReadySteps` from `src/index.ts`. The caller owns model/tool execution, authorization, persistence and retries.

## Product boundary

This package does **not** connect to an AI model, execute tools, browse the web, access user accounts, persist memory, guarantee autonomous outcomes, make safety decisions, or operate a production agent service. It is a deterministic orchestration/planning library only.
