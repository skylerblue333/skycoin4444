export type ModerationAction = 'allow' | 'review' | 'block';

export type ModerationRule = Readonly<{
  id: string;
  terms: readonly string[];
  action: Exclude<ModerationAction, 'allow'>;
  priority: number;
}>;

export type ModerationDecision = Readonly<{
  action: ModerationAction;
  matchedRuleIds: readonly string[];
  normalizedText: string;
}>;

function clean(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function normalizeTerm(value: string): string {
  return clean(value, 'term').toLocaleLowerCase('en-US');
}

export function createRule(input: ModerationRule): ModerationRule {
  if (!Number.isInteger(input.priority) || input.priority < 0) throw new Error('priority must be a non-negative integer');
  const id = clean(input.id, 'id');
  if (input.action !== 'review' && input.action !== 'block') throw new Error('rule action must be review or block');
  const terms = input.terms.map(normalizeTerm);
  if (terms.length === 0) throw new Error('at least one term is required');
  if (new Set(terms).size !== terms.length) throw new Error('duplicate term');
  return Object.freeze({ id, action: input.action, priority: input.priority, terms: Object.freeze([...terms].sort()) });
}

export function moderateText(text: string, rules: readonly ModerationRule[]): ModerationDecision {
  const normalizedText = clean(text, 'text').toLocaleLowerCase('en-US');
  const normalizedRules = rules.map(createRule);
  if (new Set(normalizedRules.map((rule) => rule.id)).size !== normalizedRules.length) throw new Error('duplicate rule id');

  const matches = normalizedRules
    .filter((rule) => rule.terms.some((term) => normalizedText.includes(term)))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));

  const action: ModerationAction = matches.some((rule) => rule.action === 'block')
    ? 'block'
    : matches.some((rule) => rule.action === 'review')
      ? 'review'
      : 'allow';

  return Object.freeze({
    action,
    matchedRuleIds: Object.freeze(matches.map((rule) => rule.id)),
    normalizedText,
  });
}

export const MODERATION_DECISION_EVENT = 'sky.moderation.decision.v1' as const;
