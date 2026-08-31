import { describe, expect, it } from 'vitest';
import { evaluateSafety } from './index';

const rules = [
  { id: 'rule:review', category: 'security', maxRisk: 30, action: 'review' },
  { id: 'rule:block', category: 'security', maxRisk: 70, action: 'block' },
] as const;

describe('HopeAI safety policy', () => {
  it('chooses the strongest matched action', () => {
    expect(evaluateSafety(rules, [{ category: 'security', risk: 80 }])).toEqual({
      action: 'block',
      matchedRuleIds: ['rule:block', 'rule:review'],
    });
  });

  it('allows when no threshold is exceeded', () => {
    expect(evaluateSafety(rules, [{ category: 'security', risk: 10 }]).action).toBe('allow');
  });

  it('rejects duplicate rules', () => {
    expect(() => evaluateSafety([rules[0], rules[0]], [])).toThrow('duplicate rule');
  });

  it('rejects invalid signal risk', () => {
    expect(() => evaluateSafety(rules, [{ category: 'security', risk: 101 }])).toThrow('risk');
  });
});
