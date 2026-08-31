import { describe, expect, it } from 'vitest';
import { accruedReward, canUnstake, claimReward } from './index';

const position = {
  ownerId: 'acct:alice',
  principal: 1000n,
  rewardBpsPerEpoch: 100,
  lockedUntilEpoch: 10n,
  lastClaimedEpoch: 2n,
} as const;

describe('Sky4 staking engine', () => {
  it('accrues deterministic integer rewards', () => {
    expect(accruedReward(position, 5n)).toBe(30n);
  });

  it('advances the claim cursor without mutating principal', () => {
    const result = claimReward(position, 5n);
    expect(result.reward).toBe(30n);
    expect(result.position.lastClaimedEpoch).toBe(5n);
    expect(result.position.principal).toBe(1000n);
  });

  it('enforces lock epochs for unstaking eligibility', () => {
    expect(canUnstake(position, 9n)).toBe(false);
    expect(canUnstake(position, 10n)).toBe(true);
  });

  it('rejects reward calculations before the claim cursor', () => {
    expect(() => accruedReward(position, 1n)).toThrow('precedes');
  });
});
