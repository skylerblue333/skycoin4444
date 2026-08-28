export type CdnPolicy = {
  id: string;
  pathPrefix: string;
  cacheControl: string;
  ttlSeconds: number;
  staleWhileRevalidateSeconds?: number;
  varyHeaders?: string[];
};

export type CdnPolicyResolvedV1 = {
  type: "sky.cdn.policy.resolved.v1";
  policyId: string;
  path: string;
  cacheControl: string;
  ttlSeconds: number;
  staleWhileRevalidateSeconds: number;
  varyHeaders: string[];
};

const clean = (value: string, field: string, max: number): string => {
  const result = value.trim();
  if (!result) throw new Error(`${field} is required`);
  if (result.length > max) throw new Error(`${field} exceeds ${max} characters`);
  return result;
};

const normalizePrefix = (value: string): string => {
  const prefix = clean(value, "pathPrefix", 500);
  if (!prefix.startsWith("/")) throw new Error("pathPrefix must start with /");
  return prefix.length > 1 && prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
};

const normalizeHeaders = (values: string[] = []): string[] =>
  [...new Set(values.map((v) => clean(v, "vary header", 120).toLowerCase()))].sort();

export function normalizeCdnPolicy(input: CdnPolicy): CdnPolicy {
  if (!Number.isInteger(input.ttlSeconds) || input.ttlSeconds < 0 || input.ttlSeconds > 31_536_000) {
    throw new Error("ttlSeconds must be an integer between 0 and 31536000");
  }
  const swr = input.staleWhileRevalidateSeconds ?? 0;
  if (!Number.isInteger(swr) || swr < 0 || swr > 604_800) {
    throw new Error("staleWhileRevalidateSeconds must be an integer between 0 and 604800");
  }
  const normalized: CdnPolicy = {
    id: clean(input.id, "policy id", 200),
    pathPrefix: normalizePrefix(input.pathPrefix),
    cacheControl: clean(input.cacheControl, "cacheControl", 500),
    ttlSeconds: input.ttlSeconds,
  };
  if (swr > 0) normalized.staleWhileRevalidateSeconds = swr;
  const headers = normalizeHeaders(input.varyHeaders);
  if (headers.length) normalized.varyHeaders = headers;
  return normalized;
}

export function resolveCdnPolicy(policies: CdnPolicy[], path: string): CdnPolicyResolvedV1 | null {
  const requestedPath = clean(path, "path", 2000);
  if (!requestedPath.startsWith("/")) throw new Error("path must start with /");
  const matches = policies
    .map(normalizeCdnPolicy)
    .filter((policy) => requestedPath === policy.pathPrefix || requestedPath.startsWith(`${policy.pathPrefix}/`))
    .sort((a, b) => b.pathPrefix.length - a.pathPrefix.length || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const selected = matches[0];
  if (!selected) return null;
  return {
    type: "sky.cdn.policy.resolved.v1",
    policyId: selected.id,
    path: requestedPath,
    cacheControl: selected.cacheControl,
    ttlSeconds: selected.ttlSeconds,
    staleWhileRevalidateSeconds: selected.staleWhileRevalidateSeconds ?? 0,
    varyHeaders: selected.varyHeaders ?? [],
  };
}
