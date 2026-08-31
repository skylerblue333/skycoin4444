import { describe, expect, it } from 'vitest';
import { assessThreat } from './index';

describe('Sky4 security threat engine', () => {
  it('scores signals deterministically', () => {
    const result = assessThreat([
      { signalId: 'signal:auth-1', category: 'auth', severity: 80, confidenceBps: 10000 },
      { signalId: 'signal:net-1', category: 'network', severity: 60, confidenceBps: 5000 },
    ]);
    expect(result.riskScore).toBe(55);
    expect(result.level).toBe('medium');
  });

  it('returns low risk for no signals', () => {
    expect(assessThreat([])).toEqual({ riskScore: 0, level: 'low', acceptedSignals: 0 });
  });

  it('rejects duplicate signal ids', () => {
    const signal = { signalId: 'signal:dup', category: 'integrity', severity: 50, confidenceBps: 5000 } as const;
    expect(() => assessThreat([signal, signal])).toThrow('duplicate signal id');
  });

  it('rejects out-of-range scoring inputs', () => {
    expect(() => assessThreat([{ signalId: 'signal:bad', category: 'auth', severity: 101, confidenceBps: 10000 }]))
      .toThrow('severity');
  });
});
