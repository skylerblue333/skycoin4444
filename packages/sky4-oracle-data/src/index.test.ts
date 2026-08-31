import { describe, expect, it } from 'vitest';
import { aggregateMedian } from './index';

const observations = [
  { sourceId: 'source:a', feedId: 'feed:usd', value: 100n, observedAt: 900 },
  { sourceId: 'source:b', feedId: 'feed:usd', value: 110n, observedAt: 950 },
  { sourceId: 'source:c', feedId: 'feed:usd', value: 1000n, observedAt: 980 },
] as const;

describe('Sky4 oracle data', () => {
  it('uses the deterministic median of fresh unique sources', () => {
    const result = aggregateMedian({ feedId: 'feed:usd', observations, now: 1000, maxAgeMs: 200, minSources: 3 });
    expect(result.median).toBe(110n);
    expect(result.sources).toBe(3);
  });

  it('uses only the newest observation per source', () => {
    const result = aggregateMedian({
      feedId: 'feed:usd',
      observations: [...observations, { sourceId: 'source:a', feedId: 'feed:usd', value: 120n, observedAt: 990 }],
      now: 1000,
      maxAgeMs: 200,
      minSources: 3,
    });
    expect(result.median).toBe(120n);
  });

  it('rejects insufficient fresh sources', () => {
    expect(() => aggregateMedian({ feedId: 'feed:usd', observations, now: 2000, maxAgeMs: 100, minSources: 2 }))
      .toThrow('insufficient fresh');
  });
});
