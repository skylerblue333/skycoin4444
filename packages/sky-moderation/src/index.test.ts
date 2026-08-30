import { describe, expect, it } from 'vitest';
import { createRule, moderateText, MODERATION_DECISION_EVENT } from './index';

describe('SkyModeration', () => {
  it('normalizes rules and allows unmatched text', () => {
    const rule = createRule({ id: ' review-spam ', terms: [' SPAM '], action: 'review', priority: 1 });
    expect(rule).toEqual({ id: 'review-spam', terms: ['spam'], action: 'review', priority: 1 });
    expect(moderateText('ordinary message', [rule]).action).toBe('allow');
  });

  it('returns review when a review rule matches', () => {
    const decision = moderateText('This contains SPAM content', [
      { id: 'review-spam', terms: ['spam'], action: 'review', priority: 2 },
    ]);
    expect(decision.action).toBe('review');
    expect(decision.matchedRuleIds).toEqual(['review-spam']);
  });

  it('uses block precedence regardless of rule priority', () => {
    const decision = moderateText('spam and malware', [
      { id: 'review-spam', terms: ['spam'], action: 'review', priority: 10 },
      { id: 'block-malware', terms: ['malware'], action: 'block', priority: 1 },
    ]);
    expect(decision.action).toBe('block');
    expect(decision.matchedRuleIds).toEqual(['review-spam', 'block-malware']);
  });

  it('orders matched rule ids deterministically by priority then id', () => {
    const decision = moderateText('alpha beta gamma', [
      { id: 'b', terms: ['beta'], action: 'review', priority: 2 },
      { id: 'a', terms: ['alpha'], action: 'review', priority: 2 },
      { id: 'c', terms: ['gamma'], action: 'review', priority: 1 },
    ]);
    expect(decision.matchedRuleIds).toEqual(['a', 'b', 'c']);
  });

  it('rejects invalid rule definitions and duplicate ids', () => {
    expect(() => createRule({ id: 'x', terms: [], action: 'review', priority: 0 })).toThrow('at least one term');
    expect(() => createRule({ id: 'x', terms: ['spam', ' SPAM '], action: 'review', priority: 0 })).toThrow('duplicate term');
    expect(() => moderateText('spam', [
      { id: 'same', terms: ['spam'], action: 'review', priority: 1 },
      { id: 'same', terms: ['other'], action: 'block', priority: 2 },
    ])).toThrow('duplicate rule id');
  });

  it('publishes the versioned provider-neutral contract name', () => {
    expect(MODERATION_DECISION_EVENT).toBe('sky.moderation.decision.v1');
  });
});
