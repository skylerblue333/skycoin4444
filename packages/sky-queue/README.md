# SkyQueue — Slot #156 / Lane 06

SkyQueue is an engineering-beta in-memory queue abstraction for deterministic scheduling and integration tests. It supports enqueue, deterministic claim ordering, explicit retry, completion, duplicate-ID protection, and bounded attempts.

## Boundaries

- This is not a durable or distributed production queue.
- No Redis, SQS, Kafka, RabbitMQ, cloud queue, worker fleet, or persistence provider is connected.
- Process restarts lose queued state.
- There are no cross-process leases, exactly-once guarantees, dead-letter persistence, or production delivery guarantees.

## SKYCOIN4444 integration contract

Schedulers/background-job adapters can target the `InMemoryQueue<T>` contract in unit/integration tests while a production adapter implements equivalent enqueue/claim/retry/complete semantics against an independently verified durable broker.

## Security and reliability notes

Job identifiers are allow-list validated, timestamps and attempt limits are checked, duplicate IDs are rejected, and claimed jobs cannot be claimed twice concurrently inside one queue instance. Callers must authenticate producers/consumers, bound payload size, encrypt sensitive data where appropriate, and use a durable backend for real workloads.

## Validation

```sh
pnpm exec vitest run packages/sky-queue/src/index.test.ts
pnpm run check:packages
pnpm exec prettier --check packages/sky-queue
pnpm audit --audit-level high
```
