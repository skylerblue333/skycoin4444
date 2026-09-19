export type ConfigPrimitive = string | number | boolean;

export interface ConfigEntry {
  key: string;
  value: ConfigPrimitive;
  source: "default" | "environment" | "runtime";
  sensitive?: boolean;
}

export interface ConfigSnapshot {
  entries: readonly ConfigEntry[];
}

export interface ConfigResolution {
  values: Record<string, ConfigPrimitive>;
  sources: Record<string, ConfigEntry["source"]>;
}

const sourcePriority: Record<ConfigEntry["source"], number> = {
  default: 0,
  environment: 1,
  runtime: 2,
};

const configSources = new Set<string>([
  "default",
  "environment",
  "runtime",
]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isConfigSource(value: unknown): value is ConfigEntry["source"] {
  return typeof value === "string" && configSources.has(value);
}

function isConfigPrimitive(value: unknown): value is ConfigPrimitive {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

export function validateConfigEntry(entry: ConfigEntry): string[] {
  if (!isObjectRecord(entry)) return ["config entry is required"];

  const errors: string[] = [];
  if (typeof entry.key !== "string" || !/^[A-Z][A-Z0-9_]*$/.test(entry.key)) {
    errors.push("key must be upper snake case");
  }
  if (!isConfigSource(entry.source)) {
    errors.push("source must be default, environment, or runtime");
  }
  if (!isConfigPrimitive(entry.value)) {
    errors.push("value must be a string, boolean, or finite number");
  }
  if (entry.sensitive !== undefined && typeof entry.sensitive !== "boolean") {
    errors.push("sensitive must be boolean when provided");
  }
  return errors;
}

function validatedEntries(snapshot: ConfigSnapshot): readonly ConfigEntry[] {
  if (!isObjectRecord(snapshot) || !Array.isArray(snapshot.entries)) {
    throw new Error("config snapshot entries must be an array");
  }

  for (const [index, entry] of snapshot.entries.entries()) {
    const errors = validateConfigEntry(entry);
    if (errors.length > 0) {
      const key =
        isObjectRecord(entry) && typeof entry.key === "string"
          ? entry.key || "<empty>"
          : `<index:${index}>`;
      throw new Error(`${key}: ${errors.join("; ")}`);
    }
  }
  return snapshot.entries;
}

export function resolveConfig(snapshot: ConfigSnapshot): ConfigResolution {
  const entries = validatedEntries(snapshot);
  const selected = new Map<string, ConfigEntry>();
  for (const entry of entries) {
    const current = selected.get(entry.key);
    if (
      !current ||
      sourcePriority[entry.source] >= sourcePriority[current.source]
    ) {
      selected.set(entry.key, entry);
    }
  }

  const values: Record<string, ConfigPrimitive> = {};
  const sources: Record<string, ConfigEntry["source"]> = {};
  for (const key of [...selected.keys()].sort()) {
    const entry = selected.get(key)!;
    values[key] = entry.value;
    sources[key] = entry.source;
  }
  return { values, sources };
}

export function redactConfig(
  snapshot: ConfigSnapshot,
): Array<{
  key: string;
  value: ConfigPrimitive | "[REDACTED]";
  source: ConfigEntry["source"];
}> {
  const entries = validatedEntries(snapshot);

  const sensitiveKeys = new Set(
    entries.filter(entry => entry.sensitive === true).map(entry => entry.key),
  );

  return entries
    .map(entry => ({
      key: entry.key,
      value: sensitiveKeys.has(entry.key)
        ? ("[REDACTED]" as const)
        : entry.value,
      source: entry.source,
    }))
    .sort((a, b) =>
      a.key === b.key
        ? sourcePriority[a.source] - sourcePriority[b.source]
        : a.key < b.key
          ? -1
          : 1,
    );
}

export function diffConfig(
  previous: ConfigResolution,
  next: ConfigResolution,
): string[] {
  if (
    !isObjectRecord(previous) ||
    !isObjectRecord(previous.values) ||
    !isObjectRecord(previous.sources) ||
    !isObjectRecord(next) ||
    !isObjectRecord(next.values) ||
    !isObjectRecord(next.sources)
  ) {
    throw new Error("config resolutions must contain values and sources");
  }

  const keys = new Set([
    ...Object.keys(previous.values),
    ...Object.keys(next.values),
  ]);
  return [...keys]
    .filter(
      key =>
        previous.values[key] !== next.values[key] ||
        previous.sources[key] !== next.sources[key],
    )
    .sort();
}
