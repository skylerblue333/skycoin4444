export type FlagValue = boolean | string | number;

export interface FeatureFlag {
  key: string;
  defaultValue: FlagValue;
  overrides?: Record<string, FlagValue>;
}

export interface FlagContext {
  subjectId: string;
  attributes?: Record<string, string>;
}

function assertKey(value: string, field: string): void {
  if (typeof value !== "string" || !/^[a-z0-9._-]{1,120}$/.test(value)) {
    throw new TypeError(`${field} must be 1-120 lowercase safe identifier characters`);
  }
}

function assertValue(value: unknown): asserts value is FlagValue {
  if (typeof value !== "boolean" && typeof value !== "string" && typeof value !== "number") {
    throw new TypeError("flag values must be boolean, string, or number");
  }
  if (typeof value === "number" && !Number.isFinite(value)) throw new TypeError("numeric flag values must be finite");
  if (typeof value === "string" && value.length > 500) throw new RangeError("string flag values must be at most 500 characters");
}

export function evaluateFlag(flag: FeatureFlag, context: FlagContext): FlagValue {
  assertKey(flag.key, "flag key");
  assertKey(context.subjectId, "subjectId");
  assertValue(flag.defaultValue);
  if (flag.overrides && Object.hasOwn(flag.overrides, context.subjectId)) {
    const override: unknown = flag.overrides[context.subjectId];
    assertValue(override);
    return override;
  }
  return flag.defaultValue;
}

export function createFlagSnapshot(flags: readonly FeatureFlag[], context: FlagContext) {
  if (!Array.isArray(flags) || flags.length > 1000) throw new RangeError("flags must contain at most 1000 entries");
  assertKey(context.subjectId, "subjectId");
  const entries: Array<[string, FlagValue]> = [];
  const seen = new Set<string>();
  for (const flag of flags) {
    assertKey(flag.key, "flag key");
    if (seen.has(flag.key)) throw new Error(`duplicate feature flag: ${flag.key}`);
    seen.add(flag.key);
    entries.push([flag.key, evaluateFlag(flag, context)]);
  }
  const values = Object.fromEntries(entries) as Record<string, FlagValue>;
  return {
    contract: "skyfeatureflags.snapshot.v1" as const,
    subjectId: context.subjectId,
    values,
  };
}
