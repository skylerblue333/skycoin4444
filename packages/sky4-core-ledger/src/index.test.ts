import { describe, expect, it } from 'vitest';
import { applyBlock, createBlock, transferId } from './index';

const ZERO = '0'.repeat(64);

describe('Sky4 ledger core', () => {
  it('hashes transfers and blocks deterministically', () => {
    const transfer = { from: 'acct:alice', to: 'acct:bob', amount: 25n, nonce: 1n } as const;
    expect(transferId(transfer)).toBe(transferId(transfer));
    expect(createBlock({ height: 1n, previousHash: ZERO, transfers: [transfer] }).hash)
      .toBe(createBlock({ height: 1n, previousHash: ZERO, transfers: [transfer] }).hash);
  });

  it('applies transfers without creating value', () => {
    const transfer = { from: 'acct:alice', to: 'acct:bob', amount: 25n, nonce: 1n } as const;
    const block = createBlock({ height: 1n, previousHash: ZERO, transfers: [transfer] });
    const result = applyBlock(new Map([['acct:alice', 100n], ['acct:bob', 10n]]), block);
    expect(result.get('acct:alice')).toBe(75n);
    expect(result.get('acct:bob')).toBe(35n);
  });

  it('rejects overdrafts and malformed transfers', () => {
    const transfer = { from: 'acct:alice', to: 'acct:bob', amount: 101n, nonce: 1n } as const;
    const block = createBlock({ height: 1n, previousHash: ZERO, transfers: [transfer] });
    expect(() => applyBlock(new Map([['acct:alice', 100n]]), block)).toThrow('insufficient balance');
    expect(() => transferId({ ...transfer, amount: 0n })).toThrow('amount must be positive');
  });

  it('rejects duplicate transfers inside one block', () => {
    const transfer = { from: 'acct:alice', to: 'acct:bob', amount: 1n, nonce: 2n } as const;
    expect(() => createBlock({ height: 2n, previousHash: ZERO, transfers: [transfer, transfer] }))
      .toThrow('duplicate transfer');
  });
});
