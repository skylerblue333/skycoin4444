import { describe, expect, it } from 'vitest';
import { planBridgeTransfer } from './index';

const route = {
  sourceChain: 'sky4',
  destinationChain: 'ethereum',
  asset: 'SKY4',
  minAmount: 10n,
  maxAmount: 10_000n,
  feeBps: 25,
} as const;

describe('Sky4 cross-chain bridge planner', () => {
  it('creates deterministic bounded transfer plans', () => {
    const input = { route, sender: 'acct:alice', recipient: '0xabc123', amount: 1000n } as const;
    const first = planBridgeTransfer(input);
    const second = planBridgeTransfer(input);
    expect(first.planId).toBe(second.planId);
    expect(first.fee).toBe(2n);
    expect(first.netAmount).toBe(998n);
  });

  it('rejects same-chain routes', () => {
    expect(() => planBridgeTransfer({ ...({ route: { ...route, destinationChain: 'sky4' }, sender: 'acct:alice', recipient: 'acct:bob', amount: 100n }) }))
      .toThrow('must differ');
  });

  it('rejects transfers outside route bounds', () => {
    expect(() => planBridgeTransfer({ route, sender: 'acct:alice', recipient: '0xabc123', amount: 1n }))
      .toThrow('outside route bounds');
  });
});
