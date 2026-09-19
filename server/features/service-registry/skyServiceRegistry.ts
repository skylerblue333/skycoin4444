export type ServiceLifecycle = "development" | "beta" | "stable" | "deprecated";

export interface ServiceDescriptor {
  id: string;
  owner: string;
  version: string;
  lifecycle: ServiceLifecycle;
  healthPath: string;
  capabilities: readonly string[];
}

export type ProviderRuntimeState =
  "test" | "pending" | "live" | "failed" | "unavailable";

export type ProviderExecutionIntent = "test" | "live";

export interface ProviderRuntimeReport {
  providerId: string;
  serviceId: string;
  state: ProviderRuntimeState;
  configured: boolean;
  authenticated: boolean;
  lastHealthCheckAt: string | null;
  latencyMs: number | null;
  capabilities: readonly string[];
  reason: string | null;
}

export interface ProviderRuntimeSummary {
  total: number;
  states: Readonly<Record<ProviderRuntimeState, number>>;
  liveCallable: number;
  testCallable: number;
}

const ID_PATTERN = /^[A-Za-z0-9._:@/-]+$/;
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/;
const MAX_REASON_LENGTH = 500;
const MAX_HEALTH_LATENCY_MS = 120_000;

function validId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 160 &&
    ID_PATTERN.test(value)
  );
}

function validLifecycle(value: unknown): value is ServiceLifecycle {
  return (
    value === "development" ||
    value === "beta" ||
    value === "stable" ||
    value === "deprecated"
  );
}

function validProviderRuntimeState(
  value: unknown
): value is ProviderRuntimeState {
  return (
    value === "test" ||
    value === "pending" ||
    value === "live" ||
    value === "failed" ||
    value === "unavailable"
  );
}

function normalizeCapabilities(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > 64) {
    throw new TypeError(
      "capabilities must be an array with at most 64 entries"
    );
  }

  const normalized = [...new Set(value.map(String))];
  if (!normalized.every(validId)) {
    throw new TypeError("capabilities must be safe identifiers");
  }

  return normalized.sort();
}

function normalizeHealthCheckTimestamp(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string" || value.length > 64) {
    throw new TypeError("lastHealthCheckAt must be an ISO timestamp or null");
  }

  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    throw new TypeError("lastHealthCheckAt must be an ISO timestamp or null");
  }

  return new Date(parsed).toISOString();
}

function normalizeReason(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") {
    throw new TypeError("reason must be a string or null");
  }

  const normalized = value.trim();
  if (!normalized || normalized.length > MAX_REASON_LENGTH) {
    throw new TypeError(
      `reason must contain 1-${MAX_REASON_LENGTH} characters when provided`
    );
  }

  return normalized;
}

export function createServiceDescriptor(input: unknown): ServiceDescriptor {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("service descriptor must be an object");
  }

  const value = input as Record<string, unknown>;
  const { id, owner, version, lifecycle, healthPath, capabilities } = value;

  if (!validId(id) || !validId(owner)) {
    throw new TypeError("service id and owner must be safe identifiers");
  }

  if (typeof version !== "string" || !VERSION_PATTERN.test(version)) {
    throw new TypeError("version must use semantic version form");
  }

  if (!validLifecycle(lifecycle)) {
    throw new TypeError("unsupported service lifecycle");
  }

  if (
    typeof healthPath !== "string" ||
    !healthPath.startsWith("/") ||
    healthPath.includes("//") ||
    healthPath.length > 240
  ) {
    throw new TypeError("healthPath must be a bounded relative path");
  }

  return {
    id,
    owner,
    version,
    lifecycle,
    healthPath,
    capabilities: normalizeCapabilities(capabilities),
  };
}

export function buildServiceCatalog(
  descriptors: readonly ServiceDescriptor[]
): ReadonlyMap<string, ServiceDescriptor> {
  const catalog = new Map<string, ServiceDescriptor>();

  for (const descriptor of descriptors) {
    if (catalog.has(descriptor.id)) {
      throw new Error(`duplicate service id: ${descriptor.id}`);
    }
    catalog.set(descriptor.id, descriptor);
  }

  return catalog;
}

export function findServicesByCapability(
  catalog: ReadonlyMap<string, ServiceDescriptor>,
  capability: string
): ServiceDescriptor[] {
  if (!validId(capability)) {
    throw new TypeError("capability must be a safe identifier");
  }

  return [...catalog.values()]
    .filter(service => service.capabilities.includes(capability))
    .sort((left, right) => left.id.localeCompare(right.id));
}

/**
 * Creates a sanitized provider status record. A provider cannot claim `live`
 * unless configuration, authenticated-adapter state, and a successful runtime
 * health-check timestamp are all present. This is intentionally fail closed.
 */
export function createProviderRuntimeReport(
  input: unknown
): ProviderRuntimeReport {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("provider runtime report must be an object");
  }

  const value = input as Record<string, unknown>;
  const {
    providerId,
    serviceId,
    state,
    configured,
    authenticated,
    lastHealthCheckAt,
    latencyMs,
    capabilities,
    reason,
  } = value;

  if (!validId(providerId) || !validId(serviceId)) {
    throw new TypeError("providerId and serviceId must be safe identifiers");
  }

  if (!validProviderRuntimeState(state)) {
    throw new TypeError("unsupported provider runtime state");
  }

  if (typeof configured !== "boolean" || typeof authenticated !== "boolean") {
    throw new TypeError("configured and authenticated must be booleans");
  }

  if (authenticated && !configured) {
    throw new TypeError("an authenticated provider must also be configured");
  }

  const normalizedHealthCheckAt =
    normalizeHealthCheckTimestamp(lastHealthCheckAt);
  let normalizedLatencyMs: number | null = null;
  if (latencyMs !== undefined && latencyMs !== null) {
    if (
      !Number.isSafeInteger(latencyMs) ||
      Number(latencyMs) < 0 ||
      Number(latencyMs) > MAX_HEALTH_LATENCY_MS
    ) {
      throw new TypeError(
        `latencyMs must be an integer from 0-${MAX_HEALTH_LATENCY_MS} or null`
      );
    }
    if (!normalizedHealthCheckAt) {
      throw new TypeError("latencyMs requires a health-check timestamp");
    }
    normalizedLatencyMs = Number(latencyMs);
  }

  const normalizedReason = normalizeReason(reason);
  if (
    (state === "pending" || state === "failed" || state === "unavailable") &&
    !normalizedReason
  ) {
    throw new TypeError(`${state} provider state requires a reason`);
  }

  if (state === "live") {
    if (!configured || !authenticated || !normalizedHealthCheckAt) {
      throw new TypeError(
        "live provider state requires configuration, authenticated adapter, and runtime health check"
      );
    }
    if (normalizedReason) {
      throw new TypeError(
        "live provider state cannot include an unavailable reason"
      );
    }
  }

  if (state === "test" && !configured) {
    throw new TypeError("test provider state requires explicit configuration");
  }

  return {
    providerId,
    serviceId,
    state,
    configured,
    authenticated,
    lastHealthCheckAt: normalizedHealthCheckAt,
    latencyMs: normalizedLatencyMs,
    capabilities: normalizeCapabilities(capabilities),
    reason: normalizedReason,
  };
}

export function isProviderCallable(
  report: ProviderRuntimeReport,
  intent: ProviderExecutionIntent
): boolean {
  if (intent === "live") {
    return (
      report.state === "live" &&
      report.configured &&
      report.authenticated &&
      report.lastHealthCheckAt !== null
    );
  }

  return report.state === "test" && report.configured;
}

export function buildProviderRuntimeCatalog(
  reports: readonly ProviderRuntimeReport[]
): ReadonlyMap<string, ProviderRuntimeReport> {
  const catalog = new Map<string, ProviderRuntimeReport>();
  for (const report of reports) {
    if (catalog.has(report.providerId)) {
      throw new Error(`duplicate provider id: ${report.providerId}`);
    }
    catalog.set(report.providerId, report);
  }
  return catalog;
}

export function summarizeProviderRuntime(
  reports: readonly ProviderRuntimeReport[]
): ProviderRuntimeSummary {
  const states: Record<ProviderRuntimeState, number> = {
    test: 0,
    pending: 0,
    live: 0,
    failed: 0,
    unavailable: 0,
  };

  let liveCallable = 0;
  let testCallable = 0;
  for (const report of reports) {
    states[report.state] += 1;
    if (isProviderCallable(report, "live")) liveCallable += 1;
    if (isProviderCallable(report, "test")) testCallable += 1;
  }

  return {
    total: reports.length,
    states,
    liveCallable,
    testCallable,
  };
}
