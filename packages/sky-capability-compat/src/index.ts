export type Capability = Readonly<{ name: string; version: number }>;
export type CapabilityRequirement = Readonly<{ name: string; minVersion: number; maxVersion?: number }>;

const NAME_RE = /^[a-z][a-z0-9.-]{1,63}$/;

function validateVersion(value: number): void {
  if (!Number.isSafeInteger(value) || value < 1 || value > 1_000_000) throw new Error('invalid capability version');
}

export function evaluateCompatibility(
  provided: readonly Capability[],
  required: readonly CapabilityRequirement[],
) {
  const available = new Map<string, number>();
  for (const capability of provided) {
    if (!NAME_RE.test(capability.name)) throw new Error(`invalid capability name: ${capability.name}`);
    validateVersion(capability.version);
    if (available.has(capability.name)) throw new Error(`duplicate provided capability: ${capability.name}`);
    available.set(capability.name, capability.version);
  }
  const seenRequired = new Set<string>();
  const missing: string[] = [];
  const incompatible: string[] = [];
  for (const requirement of required) {
    if (!NAME_RE.test(requirement.name)) throw new Error(`invalid requirement name: ${requirement.name}`);
    validateVersion(requirement.minVersion);
    if (requirement.maxVersion !== undefined) {
      validateVersion(requirement.maxVersion);
      if (requirement.maxVersion < requirement.minVersion) throw new Error(`invalid requirement range: ${requirement.name}`);
    }
    if (seenRequired.has(requirement.name)) throw new Error(`duplicate requirement: ${requirement.name}`);
    seenRequired.add(requirement.name);
    const version = available.get(requirement.name);
    if (version === undefined) missing.push(requirement.name);
    else if (version < requirement.minVersion || (requirement.maxVersion !== undefined && version > requirement.maxVersion)) incompatible.push(requirement.name);
  }
  missing.sort();
  incompatible.sort();
  return Object.freeze({ compatible: missing.length === 0 && incompatible.length === 0, missing: Object.freeze(missing), incompatible: Object.freeze(incompatible) });
}
