const FULL_GIT_SHA_PATTERN = /^[0-9a-f]{40}$/i;

export function resolveExpectedReleaseSha(raw) {
  const value = (raw ?? "").trim();
  if (!value) return null;
  if (!FULL_GIT_SHA_PATTERN.test(value)) {
    throw new Error(
      "HOSTED_LOAD_EXPECTED_SHA must be a full 40-character Git commit SHA",
    );
  }
  return value.toLowerCase();
}

export function validateHostedLoadReleaseIdentity(
  actualReleaseSha,
  expectedReleaseSha,
) {
  if (
    typeof actualReleaseSha !== "string" ||
    !FULL_GIT_SHA_PATTERN.test(actualReleaseSha)
  ) {
    throw new Error(
      "Hosted readiness must expose a full 40-character Railway release SHA",
    );
  }

  const actual = actualReleaseSha.toLowerCase();
  if (expectedReleaseSha && actual !== expectedReleaseSha) {
    throw new Error(
      `Hosted load release identity mismatch: expected ${expectedReleaseSha}, received ${actual}`,
    );
  }

  return Object.freeze({
    releaseSha: actual,
    expectedReleaseSha,
    exactReleaseMatchVerified: expectedReleaseSha !== null,
  });
}

export function validateHostedLoadReleaseSamples(
  actualReleaseShas,
  pinnedReleaseSha,
) {
  if (!Array.isArray(actualReleaseShas)) {
    throw new Error("Hosted load release samples must be an array");
  }

  const pinned = resolveExpectedReleaseSha(pinnedReleaseSha);
  if (!pinned) {
    throw new Error("Pinned hosted load release SHA is required");
  }

  for (const actualReleaseSha of actualReleaseShas) {
    validateHostedLoadReleaseIdentity(actualReleaseSha, pinned);
  }

  return Object.freeze({
    releaseSha: pinned,
    sampleCount: actualReleaseShas.length,
  });
}

function requireFiniteNonNegative(name, value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a finite non-negative number`);
  }
  return value;
}

export function evaluateHostedLoadThresholds(metrics, thresholds) {
  if (!metrics || typeof metrics !== "object") {
    throw new Error("Hosted load metrics are required");
  }
  if (!thresholds || typeof thresholds !== "object") {
    throw new Error("Hosted load thresholds are required");
  }

  const errorRate = requireFiniteNonNegative(
    "Hosted load errorRate",
    metrics.errorRate,
  );
  const p95Ms = requireFiniteNonNegative("Hosted load p95Ms", metrics.p95Ms);
  const p99Ms = requireFiniteNonNegative("Hosted load p99Ms", metrics.p99Ms);
  const maxErrorRate = requireFiniteNonNegative(
    "Hosted load maxErrorRate",
    thresholds.maxErrorRate,
  );
  const p95LimitMs = requireFiniteNonNegative(
    "Hosted load p95LimitMs",
    thresholds.p95LimitMs,
  );
  const p99LimitMs = requireFiniteNonNegative(
    "Hosted load p99LimitMs",
    thresholds.p99LimitMs,
  );

  const failures = [];
  if (errorRate > maxErrorRate) {
    failures.push(`errorRate ${errorRate.toFixed(6)} > ${maxErrorRate}`);
  }
  if (p95Ms > p95LimitMs) {
    failures.push(`p95 ${p95Ms}ms > ${p95LimitMs}ms`);
  }
  if (p99Ms > p99LimitMs) {
    failures.push(`p99 ${p99Ms}ms > ${p99LimitMs}ms`);
  }

  return Object.freeze({
    passed: failures.length === 0,
    failures: Object.freeze(failures),
  });
}
