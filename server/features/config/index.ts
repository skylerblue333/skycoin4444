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
  const errors: string[] = [];
  if (!/^[A-Z][A-Z0-9_]*$/.test(entry.key)) {
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

export function resolveConfig(snapshot: ConfigSnapshot): ConfigResolution {
  const selected = new Map<string, ConfigEntry>();
  for (const entry of snapshot.entries) {
    const errors = validateConfigEntry(entry);
    if (errors.length > 0) {
      throw new Error(`${entry.key || "<empty>"}: ${errors.join("; ")}`);
    }
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
  for (const entry of snapshot.entries) {
    const errors = validateConfigEntry(entry);
    if (errors.length > 0) {
      throw new Error(`${entry.key || "<empty>"}: ${errors.join("; ")}`);
    }
  }

  const sensitiveKeys = new Set(
    snapshot.entries
      .filter(entry => entry.sensitive === true)
      .map(entry => entry.key),
  );

  return snapshot.entries
    .map(entry => ({
      key: entry.key,
      value: sensitiveKeys.has(entry.key)
        ? ("[REDACTED]" as const)
        : entry.value,
      source: entry.source,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

export function diffConfig(
  previous: ConfigResolution,
  next: ConfigResolution,
): string[] {
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
