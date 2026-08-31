export type SafetyRule = Readonly<{
  id: string;
  category: string;
  maxRisk: number;
  action: 'allow' | 'review' | 'block';
}>;

export type SafetySignal = Readonly<{
  category: string;
  risk: number;
}>;

export type SafetyDecision = Readonly<{
  action: 'allow' | 'review' | 'block';
  matchedRuleIds: readonly string[];
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{2,128}$/;
const CATEGORY_RE = /^[a-zA-Z0-9:_-]{2,80}$/;
const rank = { allow: 0, review: 1, block: 2 } as const;

export function evaluateSafety(rules: readonly SafetyRule[], signals: readonly SafetySignal[]): SafetyDecision {
  if (rules.length > 1000 || signals.length > 1000) throw new Error('safety input limit exceeded');
  const seen = new Set<string>();
  for (const rule of rules) {
    if (!ID_RE.test(rule.id)) throw new Error('invalid rule id');
    if (seen.has(rule.id)) throw new Error('duplicate rule id');
    seen.add(rule.id);
    if (!CATEGORY_RE.test(rule.category)) throw new Error('invalid rule category');
    if (!Number.isInteger(rule.maxRisk) || rule.maxRisk < 0 || rule.maxRisk > 100) throw new Error('maxRisk must be 0-100');
  }
  for (const signal of signals) {
    if (!CATEGORY_RE.test(signal.category)) throw new Error('invalid signal category');
    if (!Number.isInteger(signal.risk) || signal.risk < 0 || signal.risk > 100) throw new Error('risk must be 0-100');
  }

  let action: SafetyDecision['action'] = 'allow';
  const matched: string[] = [];
  for (const rule of rules) {
    const risk = Math.max(0, ...signals.filter((signal) => signal.category === rule.category).map((signal) => signal.risk));
    if (risk > rule.maxRisk) {
      matched.push(rule.id);
      if (rank[rule.action] > rank[action]) action = rule.action;
    }
  }
  return Object.freeze({ action, matchedRuleIds: Object.freeze(matched.sort()) });
}
