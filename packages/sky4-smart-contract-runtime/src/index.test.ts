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

  it('binds the receipt hash to resulting state', () => {
    const incrementOnly = {
      contractId: 'contract:counter',
      version: 1,
      operations: [{ op: 'increment', key: 'counter', delta: 1n }],
    } as const;
    const fromOne = executeContract({
      program: incrementOnly,
      state: new Map([['counter', '1']]),
      gasLimit: 10n,
    });
    const fromTwo = executeContract({
      program: incrementOnly,
      state: new Map([['counter', '2']]),
      gasLimit: 10n,
    });
    expect(fromOne.state.get('counter')).toBe('2');
    expect(fromTwo.state.get('counter')).toBe('3');
    expect(fromOne.receiptHash).not.toBe(fromTwo.receiptHash);
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

  it('rejects invalid contract metadata and runtime operation values', () => {
    expect(() => executeContract({ program: { ...program, contractId: 'x' }, gasLimit: 10n })).toThrow('contractId');
    expect(() => executeContract({ program, gasLimit: 10 as never })).toThrow('positive bigint');
    expect(() => executeContract({
      program: { ...program, operations: [{ op: 'delete' as never, key: 'counter' }] as never },
      gasLimit: 10n,
    })).toThrow('unsupported contract operation');
    expect(() => executeContract({
      program: { ...program, operations: [{ op: 'increment', key: 'counter', delta: 1 as never }] },
      gasLimit: 10n,
    })).toThrow('increment delta must be a bigint');
  });

  it('validates bounded initial state before execution', () => {
    expect(() => executeContract({
      program: { ...program, operations: [] },
      state: new Map([['bad key', '1']]),
      gasLimit: 10n,
    })).toThrow('contract key');
    expect(() => executeContract({
      program: { ...program, operations: [{ op: 'increment', key: 'counter', delta: 1n }] },
      state: new Map([['counter', 'not-an-integer']]),
      gasLimit: 10n,
    })).toThrow('bounded integer');
  });
});
