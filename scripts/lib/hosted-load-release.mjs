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
