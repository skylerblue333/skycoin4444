import { describe, expect, it } from 'vitest';
import { GENESIS_MILESTONE, verifyGenesisMilestone } from './genesisMilestone';

describe('SKYCOIN4444 Genesis Milestone', () => {
  it('records one immutable commemorative milestone', () => {
    expect(GENESIS_MILESTONE.oneTime).toBe(true);
    expect(GENESIS_MILESTONE.monetaryValue).toBe(0);
    expect(GENESIS_MILESTONE.transferable).toBe(false);
    expect(GENESIS_MILESTONE.claimable).toBe(false);
    expect(GENESIS_MILESTONE.custodyCreated).toBe(false);
    expect(verifyGenesisMilestone(GENESIS_MILESTONE)).toBe(true);
  });

  it('rejects altered or monetized copies', () => {
    expect(
      verifyGenesisMilestone({ ...GENESIS_MILESTONE, monetaryValue: 1 }),
    ).toBe(false);
    expect(
      verifyGenesisMilestone({ ...GENESIS_MILESTONE, claimable: true }),
    ).toBe(false);
    expect(
      verifyGenesisMilestone({ ...GENESIS_MILESTONE, tokenMint: 'fake-mint' }),
    ).toBe(false);
  });
});
