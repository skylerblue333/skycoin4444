export interface SdkDefinition {
  id: string;
  language: string;
  packageName: string;
  version: string;
  documentationUrl?: string;
}

export interface SdkRegistrySnapshotV1 {
  type: "sky.sdk-registry.snapshot.v1";
  sdkCount: number;
  sdks: readonly SdkDefinition[];
}

function clean(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function normalize(input: SdkDefinition): SdkDefinition {
  const id = clean(input.id, "sdk id");
  const language = clean(input.language, "language").toLowerCase();
  const packageName = clean(input.packageName, "package name");
  const version = clean(input.version, "version");
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) throw new Error("version must be semver-like");
  const documentationUrl = input.documentationUrl?.trim();
  if (documentationUrl && !/^https:\/\//.test(documentationUrl)) throw new Error("documentation URL must use https");
  return { id, language, packageName, version, ...(documentationUrl ? { documentationUrl } : {}) };
}

export class SkySdkRegistry {
  private readonly sdks = new Map<string, SdkDefinition>();

  register(input: SdkDefinition): SdkDefinition {
    const sdk = normalize(input);
    if (this.sdks.has(sdk.id)) throw new Error(`duplicate sdk id: ${sdk.id}`);
    this.sdks.set(sdk.id, sdk);
    return sdk;
  }

  snapshot(): SdkRegistrySnapshotV1 {
    const sdks = [...this.sdks.values()].sort((a, b) => a.id.localeCompare(b.id));
    return { type: "sky.sdk-registry.snapshot.v1", sdkCount: sdks.length, sdks };
  }
}
