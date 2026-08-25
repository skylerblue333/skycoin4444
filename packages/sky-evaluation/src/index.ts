export interface EvaluationCase {
  id: string;
  expected: string;
  actual: string;
  weight?: number;
}

export interface EvaluationResult {
  total: number;
  passed: number;
  weightedScore: number;
  failures: string[];
}

function assertText(value: string, field: string): void {
  if (typeof value !== "string" || value.length === 0 || value.length > 10_000) {
    throw new TypeError(`${field} must be a non-empty string of at most 10000 characters`);
  }
}

export function exactMatch(actual: string, expected: string): boolean {
  return actual.trim() === expected.trim();
}

export function evaluateCases(cases: readonly EvaluationCase[]): EvaluationResult {
  if (!Array.isArray(cases) || cases.length === 0 || cases.length > 10_000) {
    throw new RangeError("cases must contain 1 to 10000 items");
  }
  let passed = 0;
  let earned = 0;
  let possible = 0;
  const failures: string[] = [];
  const seen = new Set<string>();

  for (const item of cases) {
    assertText(item.id, "id");
    if (seen.has(item.id)) throw new Error(`duplicate evaluation id: ${item.id}`);
    seen.add(item.id);
    assertText(item.expected, "expected");
    assertText(item.actual, "actual");
    const weight = item.weight ?? 1;
    if (!Number.isFinite(weight) || weight <= 0 || weight > 1000) {
      throw new RangeError("weight must be greater than 0 and at most 1000");
    }
    possible += weight;
    if (exactMatch(item.actual, item.expected)) {
      passed += 1;
      earned += weight;
    } else {
      failures.push(item.id);
    }
  }

  return {
    total: cases.length,
    passed,
    weightedScore: possible === 0 ? 0 : earned / possible,
    failures,
  };
}

export interface EvaluationIntegrationReport {
  contract: "skyevaluation.v1";
  suiteId: string;
  result: EvaluationResult;
}

export function toIntegrationReport(suiteId: string, result: EvaluationResult): EvaluationIntegrationReport {
  assertText(suiteId, "suiteId");
  return { contract: "skyevaluation.v1", suiteId, result };
}
