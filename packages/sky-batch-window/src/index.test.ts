import { describe, expect, it } from 'vitest';
import { planBatchWindows } from './index';

describe('SkyBatchWindow', () => {
  it('plans deterministically regardless of input order', () => {
    const a = planBatchWindows([{ id: 'job:b', weight: 2 }, { id: 'job:a', weight: 3 }], 2, 5);
    const b = planBatchWindows([{ id: 'job:a', weight: 3 }, { id: 'job:b', weight: 2 }], 2, 5);
    expect(a.digest).toBe(b.digest);
    expect(a.windows[0]?.itemIds).toEqual(['job:a', 'job:b']);
  });
  it('splits on count and weight boundaries', () => {
    const plan = planBatchWindows([{ id: 'job:a', weight: 4 }, { id: 'job:b', weight: 4 }], 10, 5);
    expect(plan.windows).toHaveLength(2);
  });
  it('rejects duplicates and invalid weights', () => {
    expect(() => planBatchWindows([{ id: 'job:a', weight: 1 }, { id: 'job:a', weight: 1 }], 2, 2)).toThrow('duplicate');
    expect(() => planBatchWindows([{ id: 'job:a', weight: 3 }], 2, 2)).toThrow('invalid item weight');
  });
});
