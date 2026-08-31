import { describe, expect, it } from 'vitest';
import { executeContract } from './index';

const program = {
  contractId: 'contract:counter',
  version: 1,
  operations: [
    { op: 'set', key: 'counter', value: '1' },
    { op: 'increment', key: 'counter', delta: 2n },
    { op: 'assert-eq', key: 'counter', value: '3' },
  ],
} as const;

describe('Sky4 smart contract runtime', () => {
  it('executes deterministically with bounded gas', () => {
    const first = executeContract({ program, gasLimit: 10n });
    const second = executeContract({ program, gasLimit: 10n });
    expect(first.state.get('counter')).toBe('3');
    expect(first.gasUsed).toBe(5n);
    expect(first.receiptHash).toBe(second.receiptHash);
  });

  it('fails closed on assertion mismatch', () => {
    expect(() => executeContract({
      program: { ...program, operations: [{ op: 'assert-eq', key: 'counter', value: '9' }] },
      state: new Map([['counter', '3']]),
      gasLimit: 10n,
    })).toThrow('assertion failed');
  });

  it('rejects execution over gas limit', () => {
    expect(() => executeContract({ program, gasLimit: 2n })).toThrow('gas limit exceeded');
  });

  it('rejects invalid contract metadata', () => {
    expect(() => executeContract({ program: { ...program, contractId: 'x' }, gasLimit: 10n })).toThrow('contractId');
  });
});
