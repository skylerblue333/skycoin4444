import type {
  EnterpriseAdapterDefinition,
  EnterpriseAdapterCategory,
  EnterpriseAuthKind,
  EnterpriseCapability,
  EnterpriseRiskClass,
} from "./types";

function cleanDefinition(value: string, field: string, max = 256): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(field + " is required");
  if (normalized.length > max) throw new Error(field + " exceeds " + max + " characters");
  return normalized;
}

function uniqueSorted(values: readonly string[], field: string): readonly string[] {
  const normalized = values.map((value) => cleanDefinition(value, field));
  if (new Set(normalized).size !== normalized.length) throw new Error("duplicate " + field);
  return Object.freeze([...normalized].sort());
}

function defineAdapter(
  input: Omit<EnterpriseAdapterDefinition, "externalExecutionRequired">,
): EnterpriseAdapterDefinition {
  const requiredConfig = uniqueSorted(input.requiredConfig, input.id + ".requiredConfig");
  const optionalConfig = uniqueSorted(input.optionalConfig, input.id + ".optionalConfig");
  const secretConfig = uniqueSorted(input.secretConfig, input.id + ".secretConfig");
  const declared = new Set([...requiredConfig, ...optionalConfig]);
  for (const secret of secretConfig) {
    if (!declared.has(secret)) throw new Error(input.id + ": secret config " + secret + " must be declared");
  }
  return Object.freeze({
    ...input,
    id: cleanDefinition(input.id, "adapter.id", 96),
    vendor: cleanDefinition(input.vendor, "adapter.vendor", 160),
    capabilities: Object.freeze([...new Set(input.capabilities)].sort()),
    auth: Object.freeze([...new Set(input.auth)].sort()),
    requiredConfig,
    optionalConfig,
    secretConfig,
    externalExecutionRequired: true,
  });
}

export const adapter = (
  id: string,
  vendor: string,
  category: EnterpriseAdapterCategory,
  capabilities: readonly EnterpriseCapability[],
  auth: readonly EnterpriseAuthKind[],
  requiredConfig: readonly string[],
  optionalConfig: readonly string[],
  secretConfig: readonly string[],
  risk: EnterpriseRiskClass = "standard",
): EnterpriseAdapterDefinition =>
  defineAdapter({ id, vendor, category, capabilities, auth, requiredConfig, optionalConfig, secretConfig, risk });
