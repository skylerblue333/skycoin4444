import { describe, expect, it } from 'vitest';
import { buildExplorerIndex, getTransfer, listAccountTransfers } from './index';

const a = 'a'.repeat(64);
const b = 'b'.repeat(64);

const transfers = [
  { id: a, blockHeight: 2n, from: 'acct:alice', to: 'acct:bob', amount: 10n },
  { id: b, blockHeight: 1n, from: 'acct:carol', to: 'acct:alice', amount: 4n },
] as const;

describe('Sky4 block explorer index', () => {
  it('indexes by transfer id', () => {
    const index = buildExplorerIndex(transfers);
    expect(getTransfer(index, a)?.amount).toBe(10n);
  });

  it('lists account history deterministically by height', () => {
    const index = buildExplorerIndex(transfers);
    expect(listAccountTransfers(index, 'acct:alice').map((item) => item.id)).toEqual([b, a]);
  });

  it('supports bounded pagination', () => {
    const index = buildExplorerIndex(transfers);
    expect(listAccountTransfers(index, 'acct:alice', { offset: 1, limit: 1 })).toHaveLength(1);
  });

  it('rejects duplicates and malformed identifiers', () => {
    expect(() => buildExplorerIndex([transfers[0], transfers[0]])).toThrow('duplicate transfer id');
    expect(() => getTransfer(buildExplorerIndex([]), 'bad')).toThrow('sha256');
  });
});
