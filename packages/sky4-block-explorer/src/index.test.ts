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

  it('paginates after deterministic ordering rather than insertion order', () => {
    const index = buildExplorerIndex(transfers);
    expect(listAccountTransfers(index, 'acct:alice', { offset: 0, limit: 1 }).map((item) => item.id))
      .toEqual([b]);
    expect(listAccountTransfers(index, 'acct:alice', { offset: 1, limit: 1 }).map((item) => item.id))
      .toEqual([a]);
  });

  it('rejects duplicates and malformed identifiers', () => {
    expect(() => buildExplorerIndex([transfers[0], transfers[0]])).toThrow('duplicate transfer id');
    expect(() => getTransfer(buildExplorerIndex([]), 'bad')).toThrow('sha256');
  });

  it('rejects malformed runtime bigint and pagination values', () => {
    expect(() => buildExplorerIndex([
      { ...transfers[0], blockHeight: 2 as never },
    ])).toThrow('non-negative bigint');
    expect(() => buildExplorerIndex([
      { ...transfers[0], amount: 10 as never },
    ])).toThrow('positive bigint');
    const index = buildExplorerIndex(transfers);
    expect(() => listAccountTransfers(index, 'acct:alice', { offset: Number.MAX_SAFE_INTEGER + 1 }))
      .toThrow('safe integer');
  });
});
