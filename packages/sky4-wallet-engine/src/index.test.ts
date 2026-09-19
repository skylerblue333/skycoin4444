import { describe, expect, it } from 'vitest';
import {
  applyPlannedDebit,
  planTransfer,
  validateTransferPlan,
  validateWalletAccount,
} from './index';

const account = {
  accountId: 'acct:alice',
  publicKey: 'a'.repeat(64),
  balance: 1000n,
  nextNonce: 4n,
} as const;

describe('Sky4 wallet engine', () => {
  it('creates deterministic transfer plans', () => {
    const input = {
      account,
      destination: 'acct:bob',
      amount: 100n,
      fee: 2n,
    } as const;
    expect(planTransfer(input).planId).toBe(planTransfer(input).planId);
    expect(planTransfer(input).nonce).toBe(4n);
  });

  it('debits amount plus fee and increments nonce', () => {
    const plan = planTransfer({
      account,
      destination: 'acct:bob',
      amount: 100n,
      fee: 2n,
    });
    const next = applyPlannedDebit(account, plan);
    expect(next.balance).toBe(898n);
    expect(next.nextNonce).toBe(5n);
  });

  it('rejects overdrafts and self transfers', () => {
    expect(() =>
      planTransfer({
        account,
        destination: 'acct:bob',
        amount: 1000n,
        fee: 1n,
      }),
    ).toThrow('insufficient wallet balance');
    expect(() =>
      planTransfer({
        account,
        destination: 'acct:alice',
        amount: 1n,
        fee: 0n,
      }),
    ).toThrow('destination must differ');
  });

  it('rejects stale nonce plans', () => {
    const plan = planTransfer({
      account,
      destination: 'acct:bob',
      amount: 1n,
      fee: 0n,
    });
    const advanced = { ...account, nextNonce: 5n } as const;
    expect(() => applyPlannedDebit(advanced, plan)).toThrow(
      'stale transfer nonce',
    );
  });

  it('fails closed on malformed wallet and transfer inputs', () => {
    expect(() =>
      validateWalletAccount(
        null as unknown as Parameters<typeof validateWalletAccount>[0],
      ),
    ).toThrow('wallet account is required');

    expect(() =>
      validateWalletAccount({
        ...account,
        balance: 1000 as unknown as bigint,
      }),
    ).toThrow('balance must be a bigint');

    expect(() =>
      planTransfer({
        account,
        destination: 'acct:bob',
        amount: 1 as unknown as bigint,
        fee: 0n,
      }),
    ).toThrow('amount must be a bigint');
  });

  it('rejects tampered plans before local accounting', () => {
    const plan = planTransfer({
      account,
      destination: 'acct:bob',
      amount: 100n,
      fee: 2n,
    });

    expect(() =>
      validateTransferPlan({
        ...plan,
        amount: 50n,
      }),
    ).toThrow('transfer plan integrity check failed');

    expect(() =>
      applyPlannedDebit(account, {
        ...plan,
        amount: -100n,
      }),
    ).toThrow('amount must be positive');
  });
});
