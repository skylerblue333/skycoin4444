export type PermissionEffect = "allow" | "deny";

export interface PermissionRule {
  id: string;
  resource: string;
  action: string;
  effect: PermissionEffect;
  conditions?: Record<string, string>;
}

export interface PermissionSubject {
  id: string;
  roles: readonly string[];
  attributes?: Record<string, string>;
}

export interface PermissionRequest {
  subject: PermissionSubject;
  resource: string;
  action: string;
  context?: Record<string, string>;
}

export interface PermissionDecision {
  allowed: boolean;
  matchedRuleIds: string[];
  reason: "explicit-deny" | "explicit-allow" | "default-deny";
}

/**
 * Linear-time glob matcher supporting "*" as the only wildcard token.
 * This avoids constructing attacker-influenced regular expressions and the
 * catastrophic backtracking risk that comes with repeated ".*" groups.
 */
function matchesPattern(pattern: string, value: string): boolean {
  let patternIndex = 0;
  let valueIndex = 0;
  let lastStar = -1;
  let valueAfterStar = -1;

  while (valueIndex < value.length) {
    if (patternIndex < pattern.length && pattern[patternIndex] === value[valueIndex]) {
      patternIndex += 1;
      valueIndex += 1;
      continue;
    }

    if (patternIndex < pattern.length && pattern[patternIndex] === "*") {
      lastStar = patternIndex;
      patternIndex += 1;
      valueAfterStar = valueIndex;
      continue;
    }

    if (lastStar !== -1) {
      patternIndex = lastStar + 1;
      valueAfterStar += 1;
      valueIndex = valueAfterStar;
      continue;
    }

    return false;
  }

  while (patternIndex < pattern.length && pattern[patternIndex] === "*") {
    patternIndex += 1;
  }

  return patternIndex === pattern.length;
}

function conditionsMatch(rule: PermissionRule, request: PermissionRequest): boolean {
  if (!rule.conditions) return true;

  const attributes = request.subject.attributes ?? {};
  const context = request.context ?? {};

  return Object.entries(rule.conditions).every(([key, expected]) => {
    const hasAttribute = Object.prototype.hasOwnProperty.call(attributes, key);
    const hasContext = Object.prototype.hasOwnProperty.call(context, key);

    // Fail closed when two trust domains provide conflicting values for the
    // same condition key. Context must never silently override subject claims.
    if (hasAttribute && hasContext && attributes[key] !== context[key]) {
      return false;
    }

    const actual = hasContext ? context[key] : attributes[key];
    return actual === expected;
  });
}

/**
 * Deterministic deny-overrides evaluator for the SkyPermissions engineering beta.
 * Rules are evaluated locally; this module does not provide durable policy storage,
 * external identity verification, or a production authorization gateway.
 */
export function evaluatePermissions(
  rules: readonly PermissionRule[],
  request: PermissionRequest,
): PermissionDecision {
  const matches = rules
    .filter(
      rule =>
        matchesPattern(rule.resource, request.resource) &&
        matchesPattern(rule.action, request.action) &&
        conditionsMatch(rule, request),
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const denies = matches.filter(rule => rule.effect === "deny");
  if (denies.length > 0) {
    return {
      allowed: false,
      matchedRuleIds: denies.map(rule => rule.id),
      reason: "explicit-deny",
    };
  }

  const allows = matches.filter(rule => rule.effect === "allow");
  if (allows.length > 0) {
    return {
      allowed: true,
      matchedRuleIds: allows.map(rule => rule.id),
      reason: "explicit-allow",
    };
  }

  return { allowed: false, matchedRuleIds: [], reason: "default-deny" };
}

export function validatePermissionRule(rule: PermissionRule): string[] {
  const errors: string[] = [];
  if (!rule.id.trim()) errors.push("id is required");
  if (!rule.resource.trim()) errors.push("resource is required");
  if (!rule.action.trim()) errors.push("action is required");
  if (rule.effect !== "allow" && rule.effect !== "deny") errors.push("effect must be allow or deny");
  if (rule.conditions && Object.keys(rule.conditions).some(key => !key.trim())) {
    errors.push("condition keys must be non-empty");
  }
  return errors;
}
