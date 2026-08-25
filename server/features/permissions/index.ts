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

function matchesPattern(pattern: string, value: string): boolean {
  if (pattern === "*") return true;
  if (!pattern.includes("*")) return pattern === value;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`).test(value);
}

function conditionsMatch(rule: PermissionRule, request: PermissionRequest): boolean {
  if (!rule.conditions) return true;
  const values = {
    ...(request.subject.attributes ?? {}),
    ...(request.context ?? {}),
  };
  return Object.entries(rule.conditions).every(([key, expected]) => values[key] === expected);
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
  if (rule.conditions && Object.keys(rule.conditions).some(key => !key.trim())) {
    errors.push("condition keys must be non-empty");
  }
  return errors;
}
