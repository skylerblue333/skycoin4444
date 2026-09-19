export type ModelLifecycle = "draft" | "approved" | "deprecated" | "disabled";

export interface ModelRecord {
  id: string;
  provider: string;
  model: string;
  version: string;
  lifecycle: ModelLifecycle;
  capabilities: readonly string[];
  maxInputTokens?: number;
  metadata?: Record<string, string>;
}

export interface ModelSelectionRequest {
  capability: string;
  providerAllowlist?: readonly string[];
  includeDeprecated?: boolean;
}

const modelLifecycles = new Set<string>(["draft", "approved", "deprecated", "disabled"]);

function isModelLifecycle(value: unknown): value is ModelLifecycle {
  return typeof value === "string" && modelLifecycles.has(value);
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateModelRecord(record: ModelRecord): string[] {
  const errors: string[] = [];
  if (!isNonBlankString(record.id)) errors.push("id is required");
  if (!isNonBlankString(record.provider)) errors.push("provider is required");
  if (!isNonBlankString(record.model)) errors.push("model is required");
  if (!isNonBlankString(record.version)) errors.push("version is required");
  if (!isModelLifecycle(record.lifecycle)) errors.push("lifecycle is invalid");

  if (!Array.isArray(record.capabilities) || record.capabilities.length === 0) {
    errors.push("at least one capability is required");
  } else if (record.capabilities.some(capability => !isNonBlankString(capability))) {
    errors.push("capabilities must be non-empty strings");
  }

  if (
    record.maxInputTokens !== undefined &&
    (!Number.isSafeInteger(record.maxInputTokens) || record.maxInputTokens <= 0)
  ) {
    errors.push("maxInputTokens must be a positive safe integer");
  }
  return errors;
}

export function selectModels(
  records: readonly ModelRecord[],
  request: ModelSelectionRequest,
): ModelRecord[] {
  if (!isNonBlankString(request.capability)) return [];
  const allowedProviders = request.providerAllowlist
    ? new Set(request.providerAllowlist)
    : null;

  return records
    .filter(record => validateModelRecord(record).length === 0)
    .filter(
      record =>
        record.lifecycle === "approved" ||
        (request.includeDeprecated && record.lifecycle === "deprecated"),
    )
    .filter(record => record.capabilities.includes(request.capability))
    .filter(record => !allowedProviders || allowedProviders.has(record.provider))
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function registerModel(
  records: readonly ModelRecord[],
  candidate: ModelRecord,
): ModelRecord[] {
  const errors = validateModelRecord(candidate);
  if (errors.length > 0) throw new Error(errors.join("; "));
  if (records.some(record => record.id === candidate.id)) {
    throw new Error(`model id already exists: ${candidate.id}`);
  }
  return [
    ...records,
    { ...candidate, capabilities: [...candidate.capabilities] },
  ].sort((a, b) => a.id.localeCompare(b.id));
}

export function transitionModel(
  record: ModelRecord,
  next: ModelLifecycle,
): ModelRecord {
  const allowed: Record<ModelLifecycle, readonly ModelLifecycle[]> = {
    draft: ["approved", "disabled"],
    approved: ["deprecated", "disabled"],
    deprecated: ["approved", "disabled"],
    disabled: [],
  };
  if (!isModelLifecycle(record.lifecycle)) {
    throw new Error(`invalid current lifecycle: ${String(record.lifecycle)}`);
  }
  if (!isModelLifecycle(next)) {
    throw new Error(`invalid target lifecycle: ${String(next)}`);
  }
  if (!allowed[record.lifecycle].includes(next)) {
    throw new Error(
      `invalid lifecycle transition: ${record.lifecycle} -> ${next}`,
    );
  }
  return { ...record, lifecycle: next };
}
