export type ServiceLifecycle = "development" | "beta" | "stable" | "deprecated";

export interface ServiceDescriptor {
  id: string;
  owner: string;
  version: string;
  lifecycle: ServiceLifecycle;
  healthPath: string;
  capabilities: readonly string[];
}

const ID_PATTERN = /^[A-Za-z0-9._:@/-]+$/;
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/;

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

  if (!Array.isArray(capabilities) || capabilities.length > 64) {
    throw new TypeError("capabilities must be an array with at most 64 entries");
  }

  const normalizedCapabilities = [...new Set(capabilities.map(String))];
  if (!normalizedCapabilities.every(validId)) {
    throw new TypeError("capabilities must be safe identifiers");
  }

  return {
    id,
    owner,
    version,
    lifecycle,
    healthPath,
    capabilities: normalizedCapabilities.sort(),
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
