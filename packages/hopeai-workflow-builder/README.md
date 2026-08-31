# HopeAI Workflow Builder

Engineering-beta deterministic workflow graph/planning core tracked by Issue #146.

## Capability

- validates bounded workflow node IDs and edge limits;
- rejects duplicate nodes/edges, unknown endpoints and self edges;
- detects graph cycles with deterministic topological ordering;
- derives stable SHA-256 graph IDs from canonicalized nodes/edges.

## Integration contract

Import `buildWorkflow` from `src/index.ts`. Callers provide workflow nodes/edges and own task execution, authorization, retries, persistence and UI behavior.

## Product boundary

This package does **not** execute tools/jobs, connect to AI models or external services, persist workflows, schedule background work, manage credentials, guarantee idempotency, or operate a production automation service. It is a deterministic workflow validation/planning library only.
