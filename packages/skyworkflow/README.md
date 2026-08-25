# SkyWorkflow — Wave 2 Slot #133

SkyWorkflow is an **engineering-beta deterministic workflow state-machine library**. It validates named states and event transitions, starts instances at a declared initial state, and applies allowed events with monotonic revisions.

## SKYCOIN4444 integration contract

Enterprise modules can define bounded lifecycle rules—such as a local approval flow—and persist `WorkflowInstance` values alongside their domain records. The calling service should use the instance revision for optimistic-concurrency checks when it writes authoritative state.

## Boundaries

This library does not execute arbitrary code, schedule jobs, call external systems, authorize actors, persist workflow state, provide distributed locking, or guarantee exactly-once processing. It deliberately rejects ambiguous same-state/same-event transition definitions. Authorization and side effects must occur in the integrating service around a successful state transition.

## Validation

```sh
pnpm --filter @skycoin/skyworkflow test
pnpm run check:packages
pnpm --filter @skycoin/skyworkflow format:check
```
