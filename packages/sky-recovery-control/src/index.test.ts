import { describe, expect, it } from 'vitest';
import { approveRecoveryPlan, cancelRecoveryPlan, createRecoveryPlan, executeRecoveryPlan } from './index';

describe('SkyRecoveryControl', () => {
  it('creates normalized planned recovery records', () => {
    expect(createRecoveryPlan(' r1 ', ' backup://daily ')).toEqual({ id: 'r1', targetRef: 'backup://daily', status: 'planned', version: 1 });
  });

  it('requires approval before deterministic execution', () => {
    const plan = createRecoveryPlan('r1', 'backup://daily');
    expect(() => executeRecoveryPlan(plan, '2026-08-30T20:00:00.000Z')).toThrow('only approved recovery can execute');
    const executed = executeRecoveryPlan(approveRecoveryPlan(plan, 'ops-1'), '2026-08-30T20:00:00.000Z');
    expect(executed).toMatchObject({ status: 'executed', approvedBy: 'ops-1', executedAt: '2026-08-30T20:00:00.000Z', version: 3 });
  });

  it('rejects non-strict or impossible timestamps', () => {
    const approved = approveRecoveryPlan(createRecoveryPlan('r1', 'backup://daily'), 'ops-1');
    expect(() => executeRecoveryPlan(approved, '2026-02-30T00:00:00.000Z')).toThrow('strict ISO-8601 UTC');
    expect(() => executeRecoveryPlan(approved, '2026-08-30')).toThrow('strict ISO-8601 UTC');
  });

  it('enforces terminal cancellation boundaries', () => {
    const cancelled = cancelRecoveryPlan(createRecoveryPlan('r1', 'backup://daily'));
    expect(cancelRecoveryPlan(cancelled)).toBe(cancelled);
    const executed = executeRecoveryPlan(approveRecoveryPlan(createRecoveryPlan('r2', 'backup://weekly'), 'ops-1'), '2026-08-30T20:00:00.000Z');
    expect(() => cancelRecoveryPlan(executed)).toThrow('executed recovery cannot be cancelled');
  });
});
