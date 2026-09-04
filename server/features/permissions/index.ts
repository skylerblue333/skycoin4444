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

const MAX_PERMISSION_TOKEN_LENGTH = 256;
const MAX_PERMISSION_WILDCARDS = 16;

function countWildcards(value: string): number {
  let count = 0;
  for (const character of value) {
    if (character === "*") count += 1;
  }
  return count;
}

function buildPrefixTable(value: string): number[] {
  const table = Array<number>(value.length).fill(0);
  let prefixLength = 0;

  for (let index = 1; index < value.length; index += 1) {
    while (prefixLength > 0 && value[index] !== value[prefixLength]) {
      prefixLength = table[prefixLength - 1];
    }
    if (value[index] === value[prefixLength]) {
      prefixLength += 1;
      table[index] = prefixLength;
    }
  }

  return table;
}

function findSegment(value: string, segment: string, startIndex: number): number {
  if (!segment) return startIndex;

  const prefixTable = buildPrefixTable(segment);
  let segmentIndex = 0;

  for (let valueIndex = startIndex; valueIndex < value.length; valueIndex += 1) {
    while (segmentIndex > 0 && value[valueIndex] !== segment[segmentIndex]) {
      segmentIndex = prefixTable[segmentIndex - 1];
    }
    if (value[valueIndex] === segment[segmentIndex]) {
      segmentIndex += 1;
      if (segmentIndex === segment.length) {
        return valueIndex - segment.length + 1;
      }
    }
  }

  return -1;
}

function matchesPattern(pattern: string, value: string): boolean {
  if (
    pattern.length > MAX_PERMISSION_TOKEN_LENGTH ||
    value.length > MAX_PERMISSION_TOKEN_LENGTH ||
    countWildcards(pattern) > MAX_PERMISSION_WILDCARDS
  ) {
    return false;
  }

  if (pattern === "*") return true;
  if (!pattern.includes("*")) return pattern === value;

  const segments = pattern.split("*").filter(Boolean);
  let cursor = 0;
  let segmentIndex = 0;

  if (!pattern.startsWith("*")) {
    const firstSegment = segments[0] ?? "";
    if (!value.startsWith(firstSegment)) return false;
    cursor = firstSegment.length;
    segmentIndex = 1;
  }

  const mustMatchEnd = !pattern.endsWith("*");
  const finalSegmentIndex = segments.length - 1;

  for (; segmentIndex < segments.length; segmentIndex += 1) {
    const segment = segments[segmentIndex];
    const isFinalSegment = segmentIndex === finalSegmentIndex;

    if (isFinalSegment && mustMatchEnd) {
      const finalStart = value.length - segment.length;
      return finalStart >= cursor && value.endsWith(segment);
    }

    const matchIndex = findSegment(value, segment, cursor);
    if (matchIndex < 0) return false;
    cursor = matchIndex + segment.length;
  }

  return true;
}

function hasOwn(record: Record<string, string>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function conditionsMatch(rule: PermissionRule, request: PermissionRequest): boolean {
  if (!rule.conditions) return true;

  const subjectAttributes = request.subject.attributes ?? {};
  const context = request.context ?? {};

  for (const [key, expected] of Object.entries(rule.conditions)) {
    const subjectHasKey = hasOwn(subjectAttributes, key);
    const contextHasKey = hasOwn(context, key);

    // Fail closed when the same conditioned key exists in both namespaces.
    // This prevents caller-controlled request context from shadowing an
    // authenticated subject attribute such as tenantId.
    if (subjectHasKey && contextHasKey) return false;

    if (subjectHasKey) {
      if (subjectAttributes[key] !== expected) return false;
      continue;
    }

    if (contextHasKey) {
      if (context[key] !== expected) return false;
      continue;
    }

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
  if (rule.resource.length > MAX_PERMISSION_TOKEN_LENGTH) {
    errors.push(`resource must be <= ${MAX_PERMISSION_TOKEN_LENGTH} characters`);
  }
  if (rule.action.length > MAX_PERMISSION_TOKEN_LENGTH) {
    errors.push(`action must be <= ${MAX_PERMISSION_TOKEN_LENGTH} characters`);
  }
  if (countWildcards(rule.resource) > MAX_PERMISSION_WILDCARDS) {
    errors.push(`resource must contain <= ${MAX_PERMISSION_WILDCARDS} wildcards`);
  }
  if (countWildcards(rule.action) > MAX_PERMISSION_WILDCARDS) {
    errors.push(`action must contain <= ${MAX_PERMISSION_WILDCARDS} wildcards`);
  }
  if (rule.conditions && Object.keys(rule.conditions).some(key => !key.trim())) {
    errors.push("condition keys must be non-empty");
  }
  return errors;
}
