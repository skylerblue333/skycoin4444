# SkyScheduler — Slot #155 / Lane 05

SkyScheduler is an **engineering-beta scheduling planner/domain core** for SKYCOIN4444. It deterministically computes due one-time and interval schedules, supports pause/resume, and requires acknowledgement of the exact expected dispatch before recurring state advances.

## Integration contract

`SchedulerDispatchContract` emits `skyscheduler.dispatch.v1` with schedule ID, task name, and due timestamp. A future SkyQueue, worker runtime, or service adapter may consume that contract.

## Truth and security boundary

This library does not run background processes, persist jobs, provide distributed locks, guarantee exactly-once delivery, retry failed work, execute arbitrary code, connect to a queue, or claim production scheduling. Production adapters must provide durable state, leader/lease coordination, authenticated job registration, worker authorization, retry/dead-letter policy, observability, clock discipline, idempotent handlers, and execution evidence.

## Validation

```bash
pnpm run check:packages
pnpm exec vitest run --config packages/sky-scheduler/vitest.config.ts
pnpm exec prettier --check packages/sky-scheduler
```

No runtime dependency is added. Repository CI is authoritative for merge readiness.
