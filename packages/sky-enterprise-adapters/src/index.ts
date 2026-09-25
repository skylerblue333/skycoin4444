export * from "./types";

import type {
  AdapterCommand,
  AdapterConfig,
  AdapterReadiness,
  EnterpriseAdapterCategory,
  EnterpriseAdapterDefinition,
  EnterpriseCapability,
  IntegrationCoverage,
  IntegrationRequirement,
} from "./types";
import { ADAPTERS as IDENTITY_WORKFORCE } from "./catalog/identity-workforce";
import { ADAPTERS as CUSTOMER_COMMUNICATIONS } from "./catalog/customer-communications";
import { ADAPTERS as FINANCE_COMMERCE } from "./catalog/finance-commerce";
import { ADAPTERS as PLATFORM_DATA_EVENTS } from "./catalog/platform-data-events";
import { ADAPTERS as OPERATIONS_DEVELOPER_ANALYTICS } from "./catalog/operations-developer-analytics";
import { ADAPTERS as AI_DOCUMENTS } from "./catalog/ai-documents";

const MAX_CONFIG_VALUE = 16_384;
const MAX_STRING_VALUE = 8_192;
const MAX_PAYLOAD_CHARS = 64 * 1024;
const FORBIDDEN_OBJECT_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function clean(value: string, field: string, max = 256): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(field + " is required");
  if (normalized.length > max) throw new Error(field + " exceeds " + max + " characters");
  return normalized;
}

export const ENTERPRISE_ADAPTERS: readonly EnterpriseAdapterDefinition[] = Object.freeze([
  ...IDENTITY_WORKFORCE,
  ...CUSTOMER_COMMUNICATIONS,
  ...FINANCE_COMMERCE,
  ...PLATFORM_DATA_EVENTS,
  ...OPERATIONS_DEVELOPER_ANALYTICS,
  ...AI_DOCUMENTS,
]);

const ADAPTER_BY_ID = new Map(
  ENTERPRISE_ADAPTERS.map((definition) => [definition.id, definition] as const),
);
if (ADAPTER_BY_ID.size !== ENTERPRISE_ADAPTERS.length) {
  throw new Error("enterprise adapter ids must be unique");
}

export function getEnterpriseAdapter(adapterId: string): EnterpriseAdapterDefinition {
  const id = clean(adapterId, "adapterId", 96);
  const definition = ADAPTER_BY_ID.get(id);
  if (!definition) throw new Error("unknown enterprise adapter: " + id);
  return definition;
}

export function listEnterpriseAdapters(input: {
  category?: EnterpriseAdapterCategory;
  capability?: EnterpriseCapability;
} = {}): readonly EnterpriseAdapterDefinition[] {
  return Object.freeze(
    ENTERPRISE_ADAPTERS
      .filter((definition) => !input.category || definition.category === input.category)
      .filter(
        (definition) =>
          !input.capability || definition.capabilities.includes(input.capability),
      )
      .sort((left, right) => left.id.localeCompare(right.id)),
  );
}

export function inspectAdapterReadiness(
  adapterId: string,
  config: AdapterConfig,
): AdapterReadiness {
  const definition = getEnterpriseAdapter(adapterId);
  const allowed = new Set([
    ...definition.requiredConfig,
    ...definition.optionalConfig,
  ]);
  const configured: string[] = [];

  for (const [key, rawValue] of Object.entries(config)) {
    if (!allowed.has(key)) {
      throw new Error(definition.id + ": unknown config key " + key);
    }
    if (rawValue === undefined || !rawValue.trim()) continue;
    if (rawValue.length > MAX_CONFIG_VALUE) {
      throw new Error(definition.id + ": config value for " + key + " is too large");
    }
    configured.push(key);
  }

  const configuredSet = new Set(configured);
  const missing = definition.requiredConfig.filter((key) => !configuredSet.has(key));
  const secretsPresent = definition.secretConfig.filter((key) => configuredSet.has(key));

  return Object.freeze({
    adapterId: definition.id,
    status:
      missing.length === 0 ? "ready-for-external-execution" : "unconfigured",
    missing: Object.freeze([...missing].sort()),
    configured: Object.freeze([...configured].sort()),
    secretsPresent: Object.freeze([...secretsPresent].sort()),
    externalConnectivityVerified: false,
    networkCallPerformed: false,
  });
}

function assertSafeJson(value: unknown, path = "payload", depth = 0): void {
  if (depth > 8) throw new Error(path + " exceeds maximum nesting depth");
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(path + " must contain finite numbers");
    return;
  }
  if (typeof value === "string") {
    if (value.length > MAX_STRING_VALUE) throw new Error(path + " string is too large");
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > 100) throw new Error(path + " array is too large");
    value.forEach((item, index) => assertSafeJson(item, path + "[" + index + "]", depth + 1));
    return;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length > 100) throw new Error(path + " object has too many keys");
    for (const [key, child] of entries) {
      if (FORBIDDEN_OBJECT_KEYS.has(key)) throw new Error(path + " contains unsafe key " + key);
      clean(key, path + " key", 160);
      assertSafeJson(child, path + "." + key, depth + 1);
    }
    return;
  }
  throw new Error(path + " contains an unsupported value");
}

export function createAdapterCommand(input: {
  adapterId: string;
  capability: EnterpriseCapability;
  requestId: string;
  subject?: string;
  payload?: Readonly<Record<string, unknown>>;
}): AdapterCommand {
  const definition = getEnterpriseAdapter(input.adapterId);
  if (!definition.capabilities.includes(input.capability)) {
    throw new Error(
      definition.id + " does not declare capability " + input.capability,
    );
  }

  const requestId = clean(input.requestId, "requestId", 160);
  const subject =
    input.subject === undefined ? undefined : clean(input.subject, "subject", 256);
  const payload = input.payload ?? Object.freeze({});
  assertSafeJson(payload);
  const serialized = JSON.stringify(payload);
  if (serialized.length > MAX_PAYLOAD_CHARS) {
    throw new Error("payload exceeds maximum serialized size");
  }

  return Object.freeze({
    contract: "sky.enterprise-adapter.command.v1",
    commandId: "enterprise:" + definition.id + ":" + requestId,
    adapterId: definition.id,
    capability: input.capability,
    requestId,
    ...(subject ? { subject } : {}),
    payload: Object.freeze({ ...payload }),
    requiresExternalExecution: true,
    networkCallPerformed: false,
  });
}

export function assessIntegrationCoverage(
  requirements: readonly IntegrationRequirement[],
  configuredAdapters: Readonly<Record<string, AdapterConfig>> = {},
): readonly IntegrationCoverage[] {
  const seen = new Set<EnterpriseCapability>();

  return Object.freeze(
    requirements.map((requirement) => {
      if (seen.has(requirement.capability)) {
        throw new Error("duplicate integration requirement: " + requirement.capability);
      }
      seen.add(requirement.capability);

      const catalog = listEnterpriseAdapters({ capability: requirement.capability });
      const configured = catalog.filter((definition) => {
        const config = configuredAdapters[definition.id];
        return (
          config !== undefined &&
          inspectAdapterReadiness(definition.id, config).status ===
            "ready-for-external-execution"
        );
      });

      return Object.freeze({
        capability: requirement.capability,
        criticality: requirement.criticality,
        status:
          configured.length > 0
            ? "configured"
            : catalog.length > 0
              ? "catalog-only"
              : "missing",
        configuredAdapters: Object.freeze(configured.map((item) => item.id).sort()),
        catalogAdapters: Object.freeze(catalog.map((item) => item.id).sort()),
      });
    }),
  );
}

export function summarizeIntegrationGaps(
  coverage: readonly IntegrationCoverage[],
): Readonly<{
  total: number;
  configured: number;
  catalogOnly: number;
  missing: number;
  requiredGaps: readonly EnterpriseCapability[];
}> {
  const requiredGaps = coverage
    .filter((item) => item.criticality === "required" && item.status !== "configured")
    .map((item) => item.capability)
    .sort();

  return Object.freeze({
    total: coverage.length,
    configured: coverage.filter((item) => item.status === "configured").length,
    catalogOnly: coverage.filter((item) => item.status === "catalog-only").length,
    missing: coverage.filter((item) => item.status === "missing").length,
    requiredGaps: Object.freeze(requiredGaps),
  });
}
