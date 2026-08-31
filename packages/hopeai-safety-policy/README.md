# HopeAI Safety Policy

Engineering-beta deterministic policy/guardrail evaluation core tracked by Issue #146.

## Capability

- validates bounded rule IDs, categories, thresholds, actions and signal risk values;
- rejects duplicate rules and invalid inputs;
- evaluates category-specific risk against configured thresholds;
- deterministically chooses the strongest matched `allow` / `review` / `block` action and records matched rule IDs.

## Integration contract

Import `evaluateSafety` from `src/index.ts`. Callers provide rules/signals and own signal generation, policy governance, human review and enforcement.

## Security and product boundary

This package does **not** understand arbitrary content, connect to an AI model, guarantee safety, replace human review, enforce account permissions, moderate a production service, certify compliance, or detect every harmful input. It is a deterministic rule-evaluation library only.
