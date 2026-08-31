import { describe, expect, it } from 'vitest';
import { effectiveWeight, selectValidator } from './index';

const candidates = [
  { validatorId: 'validator:a', stake: 1000n, uptimeBps: 9900, penaltyPoints: 0 },
  { validatorId: 'validator:b', stake: 500n, uptimeBps: 9000, penaltyPoints: 100 },
] as const;

describe('Sky4 validator/mining simulation', () => {
  it('computes deterministic effective weights', () => {
    expect(effectiveWeight(candidates[0])).toBe(990n);
    expect(effectiveWeight(candidates[1])).toBe(446n);
  });

  it('selects deterministically from the same seed', () => {
    expect(selectValidator({ candidates, seed: 'round-seed-0001' }).selectedValidatorId)
      .toBe(selectValidator({ candidates, seed: 'round-seed-0001' }).selectedValidatorId);
  });

  it('rejects duplicate validator ids', () => {
    expect(() => selectValidator({ candidates: [candidates[0], candidates[0]], seed: 'round-seed-0001' }))
      .toThrow('duplicate validator id');
  });

  it('rejects candidates with zero effective weight', () => {
    expect(() => selectValidator({
      candidates: [{ validatorId: 'validator:x', stake: 1n, uptimeBps: 0, penaltyPoints: 0 }],
      seed: 'round-seed-0001',
    })).toThrow('effective weight');
  });
});
