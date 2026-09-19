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

const MAX_PERMISSION_PATTERN_LENGTH = 512;
const MAX_PERMISSION_VALUE_LENGTH = 4_096;

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.entries(value).every(
      ([key, item]) => key.trim().length > 0 && typeof item === "string",
    )
  );
}

function compareText(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Non-regex glob matcher supporting "*" as the only wildcard token.
 * Pattern/value lengths are bounded at the validation/evaluation boundary so
 * attacker-controlled input cannot recreate unbounded regex-style backtracking.
 */
function matchesPattern(pattern: string, value: string): boolean {
  if (
    pattern.length > MAX_PERMISSION_PATTERN_LENGTH ||
    value.length > MAX_PERMISSION_VALUE_LENGTH
  ) {
    return false;
  }

  let patternIndex = 0;
  let valueIndex = 0;
  let lastStar = -1;
  let valueAfterStar = -1;

  while (valueIndex < value.length) {
    if (
      patternIndex < pattern.length &&
      pattern[patternIndex] === value[valueIndex]
    ) {
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

function conditionsMatch(
  rule: PermissionRule,
  request: PermissionRequest,
): boolean {
  if (!rule.conditions) return true;

  const attributes = request.subject.attributes ?? {};
  const context = request.context ?? {};

  return Object.entries(rule.conditions).every(([key, expected]) => {
    const hasAttribute = Object.prototype.hasOwnProperty.call(attributes, key);
    const hasContext = Object.prototype.hasOwnProperty.call(context, key);

    // Fail closed when two trust domains provide conflicting values for the
    // same condition key. Context must never silently override subject claims.
    if (
      hasAttribute &&
      hasContext &&
      attributes[key] !== context[key]
    ) {
      return false;
    }

    const actual = hasContext ? context[key] : attributes[key];
    return actual === expected;
  });
}

function isValidPermissionRequest(request: PermissionRequest): boolean {
  if (
    !request ||
    typeof request !== "object" ||
    !request.subject ||
    typeof request.subject !== "object"
  ) {
    return false;
  }

  if (!isNonBlankString(request.subject.id)) return false;
  if (
    !Array.isArray(request.subject.roles) ||
    request.subject.roles.some(role => !isNonBlankString(role))
  ) {
    return false;
  }
  if (
    !isNonBlankString(request.resource) ||
    request.resource.length > MAX_PERMISSION_VALUE_LENGTH
  ) {
    return false;
  }
  if (
    !isNonBlankString(request.action) ||
    request.action.length > MAX_PERMISSION_VALUE_LENGTH
  ) {
    return false;
  }
  if (
    request.subject.attributes !== undefined &&
    !isStringRecord(request.subject.attributes)
  ) {
    return false;
  }
  if (request.context !== undefined && !isStringRecord(request.context)) {
    return false;
  }
  return true;
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
  const defaultDeny: PermissionDecision = {
    allowed: false,
    matchedRuleIds: [],
    reason: "default-deny",
  };

  if (
    !Array.isArray(rules) ||
    !isValidPermissionRequest(request) ||
    rules.some(rule => validatePermissionRule(rule).length > 0)
  ) {
    return defaultDeny;
  }

  const matches = rules
    .filter(
      rule =>
        matchesPattern(rule.resource, request.resource) &&
        matchesPattern(rule.action, request.action) &&
        conditionsMatch(rule, request),
    )
    .sort((a, b) => compareText(a.id, b.id));

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

  return defaultDeny;
}

export function validatePermissionRule(rule: PermissionRule): string[] {
  const errors: string[] = [];

  if (!rule || typeof rule !== "object") {
    return ["rule is required"];
  }

  if (!isNonBlankString(rule.id)) errors.push("id is required");
  if (!isNonBlankString(rule.resource)) {
    errors.push("resource is required");
  } else if (rule.resource.length > MAX_PERMISSION_PATTERN_LENGTH) {
    errors.push(
      `resource pattern must be at most ${MAX_PERMISSION_PATTERN_LENGTH} characters`,
    );
  }

  if (!isNonBlankString(rule.action)) {
    errors.push("action is required");
  } else if (rule.action.length > MAX_PERMISSION_PATTERN_LENGTH) {
    errors.push(
      `action pattern must be at most ${MAX_PERMISSION_PATTERN_LENGTH} characters`,
    );
  }

  if (rule.effect !== "allow" && rule.effect !== "deny") {
    errors.push("effect must be allow or deny");
  }

  if (rule.conditions !== undefined && !isStringRecord(rule.conditions)) {
    errors.push("conditions must contain non-empty keys and string values");
  }

  return errors;
}
