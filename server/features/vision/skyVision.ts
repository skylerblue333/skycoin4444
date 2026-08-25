export type VisionTask = "classify" | "detect" | "caption" | "extract_text";

export interface VisionJob {
  id: string;
  assetId: string;
  task: VisionTask;
  requestedAtMs: number;
  maxResults: number;
}

const ID_PATTERN = /^[A-Za-z0-9._:@/-]+$/;
const MAX_RESULTS = 100;

function validId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 160 &&
    ID_PATTERN.test(value)
  );
}

function validTask(value: unknown): value is VisionTask {
  return (
    value === "classify" ||
    value === "detect" ||
    value === "caption" ||
    value === "extract_text"
  );
}

export function createVisionJob(input: unknown): VisionJob {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("vision job must be an object");
  }

  const value = input as Record<string, unknown>;
  const { id, assetId, task, requestedAtMs, maxResults } = value;

  if (!validId(id) || !validId(assetId)) {
    throw new TypeError("id and assetId must be safe identifiers");
  }

  if (!validTask(task)) {
    throw new TypeError("unsupported vision task");
  }

  if (
    typeof requestedAtMs !== "number" ||
    !Number.isSafeInteger(requestedAtMs) ||
    requestedAtMs < 0
  ) {
    throw new TypeError("requestedAtMs must be a non-negative safe integer");
  }

  if (
    typeof maxResults !== "number" ||
    !Number.isSafeInteger(maxResults) ||
    maxResults < 1 ||
    maxResults > MAX_RESULTS
  ) {
    throw new RangeError("maxResults must be an integer from 1 to 100");
  }

  return { id, assetId, task, requestedAtMs, maxResults };
}

export interface VisionResultEnvelope {
  jobId: string;
  provider: string;
  completedAtMs: number;
  resultCount: number;
}

export function validateVisionResultEnvelope(
  input: unknown,
  job: VisionJob
): VisionResultEnvelope {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("vision result envelope must be an object");
  }

  const value = input as Record<string, unknown>;
  const { jobId, provider, completedAtMs, resultCount } = value;

  if (jobId !== job.id) {
    throw new Error("vision result does not match job");
  }

  if (!validId(provider)) {
    throw new TypeError("provider must be a safe identifier");
  }

  if (
    typeof completedAtMs !== "number" ||
    !Number.isSafeInteger(completedAtMs) ||
    completedAtMs < job.requestedAtMs
  ) {
    throw new RangeError("completedAtMs cannot precede the request");
  }

  if (
    typeof resultCount !== "number" ||
    !Number.isSafeInteger(resultCount) ||
    resultCount < 0 ||
    resultCount > job.maxResults
  ) {
    throw new RangeError("resultCount exceeds the job policy");
  }

  return { jobId, provider, completedAtMs, resultCount };
}
