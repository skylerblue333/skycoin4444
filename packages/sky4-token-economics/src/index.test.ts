import { describe, expect, it } from 'vitest';
import { allocationPercentBps, projectSupply, validateAllocations } from './index';

describe('Sky4 token economics', () => {
  it('validates exact supply allocations', () => {
    expect(() => validateAllocations([
      { bucket: 'founder', amount: 300n },
      { bucket: 'community', amount: 700n },
    ], 1000n)).not.toThrow();
  });

  it('rejects allocation totals that mint or burn value implicitly', () => {
    expect(() => validateAllocations([{ bucket: 'community', amount: 999n }], 1000n))
      .toThrow('equal expected supply');
  });

  it('projects deterministic integer supply growth', () => {
    expect(projectSupply({ initialSupply: 1000n, annualInflationBps: 500, years: 2 }))
      .toEqual([1000n, 1050n, 1102n]);
  });

  it('reports allocation percentages in basis points', () => {
    expect(allocationPercentBps(300n, 1000n)).toBe(3000);
  });
});
