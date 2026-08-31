import { describe, expect, it } from 'vitest';
import { planSettlement, reconcileSettlement } from './index';

const instruction = {
  reference: 'invoice:1001',
  payerAccount: 'acct:enterprise-a',
  payeeAccount: 'acct:enterprise-b',
  asset: 'SKY4',
  amount: 5000n,
  dueAt: 1000,
} as const;

describe('Sky4 enterprise settlement contracts', () => {
  it('creates deterministic settlement plan ids', () => {
    expect(planSettlement(instruction, 500).planId).toBe(planSettlement(instruction, 500).planId);
  });

  it('marks overdue plans expired', () => {
    expect(planSettlement(instruction, 1001).status).toBe('expired');
  });

  it('reconciles only matching evidence', () => {
    const plan = planSettlement(instruction, 500);
    expect(reconcileSettlement(plan, { reference: 'invoice:1001', amount: 5000n, asset: 'SKY4' })).toBe(true);
    expect(reconcileSettlement(plan, { reference: 'invoice:1001', amount: 4999n, asset: 'SKY4' })).toBe(false);
  });

  it('rejects self-settlement instructions', () => {
    expect(() => planSettlement({ ...instruction, payeeAccount: instruction.payerAccount }, 500)).toThrow('must differ');
  });
});
