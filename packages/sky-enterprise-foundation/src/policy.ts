/**
 * Ported from skylerblue333/skycoin-security at
 * be04350399870257e60702819cc931d1e76f990c (MIT).
 */
export type PolicyEffect = "allow" | "deny";

export interface PolicyRule {
  id: string;
  effect: PolicyEffect;
  principals: string[];
  actions: string[];
  resources: string[];
  priority?: number;
}

export interface PolicyRequest {
  principal: string;
  action: string;
  resource: string;
}

export interface PolicyDecision {
  allowed: boolean;
  effect: PolicyEffect;
  matchedRuleId: string | null;
  reason: "matched-rule" | "default-deny";
  enforcementPerformed: false;
}

const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$/;
const MAX_RULES = 1_000;
const MAX_MATCHERS = 64;

function assertToken(
  value: unknown,
  field: string,
  wildcard = false,
): asserts value is string {
  if (
    typeof value !== "string" ||
    (!TOKEN.test(value) && !(wildcard && value === "*"))
  ) {
    throw new TypeError(`${field} must be a bounded policy token`);
  }
}

function normalizeMatchers(values: unknown, field: string): string[] {
  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    values.length > MAX_MATCHERS
  ) {
    throw new TypeError(`${field} must contain 1-${MAX_MATCHERS} matchers`);
  }
  const normalized = values.map((value, index) => {
    assertToken(value, `${field}[${index}]`, true);
    return value;
  });
  return [...new Set(normalized)].sort();
}

export function normalizeRule(rule: PolicyRule): Required<PolicyRule> {
  if (!rule || typeof rule !== "object") {
    throw new TypeError("rule is required");
  }
  assertToken(rule.id, "rule.id");
  if (rule.effect !== "allow" && rule.effect !== "deny") {
    throw new TypeError("rule.effect must be allow or deny");
  }
  const priority = rule.priority ?? 0;
  if (
    !Number.isSafeInteger(priority) ||
    priority < -10_000 ||
    priority > 10_000
  ) {
    throw new TypeError(
      "rule.priority must be an integer from -10000 to 10000",
    );
  }
  return {
    id: rule.id,
    effect: rule.effect,
    principals: normalizeMatchers(rule.principals, "rule.principals"),
    actions: normalizeMatchers(rule.actions, "rule.actions"),
    resources: normalizeMatchers(rule.resources, "rule.resources"),
    priority,
  };
}

function matches(list: string[], value: string): boolean {
  return list.includes("*") || list.includes(value);
}

export function evaluatePolicy(
  request: PolicyRequest,
  rules: PolicyRule[],
): PolicyDecision {
  if (!request || typeof request !== "object") {
    throw new TypeError("request is required");
  }
  assertToken(request.principal, "request.principal");
  assertToken(request.action, "request.action");
  assertToken(request.resource, "request.resource");
  if (!Array.isArray(rules) || rules.length > MAX_RULES) {
    throw new TypeError(`rules must contain at most ${MAX_RULES} entries`);
  }

  const normalized = rules.map(normalizeRule);
  const ids = new Set<string>();
  for (const rule of normalized) {
    if (ids.has(rule.id)) throw new TypeError(`duplicate rule id: ${rule.id}`);
    ids.add(rule.id);
  }

  const candidates = normalized
    .filter(
      (rule) =>
        matches(rule.principals, request.principal) &&
        matches(rule.actions, request.action) &&
        matches(rule.resources, request.resource),
    )
    .sort(
      (left, right) =>
        right.priority - left.priority ||
        (left.effect === right.effect
          ? left.id.localeCompare(right.id)
          : left.effect === "deny"
            ? -1
            : 1),
    );

  const winner = candidates[0];
  if (!winner) {
    return {
      allowed: false,
      effect: "deny",
      matchedRuleId: null,
      reason: "default-deny",
      enforcementPerformed: false,
    };
  }
  return {
    allowed: winner.effect === "allow",
    effect: winner.effect,
    matchedRuleId: winner.id,
    reason: "matched-rule",
    enforcementPerformed: false,
  };
}
