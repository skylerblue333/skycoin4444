export interface SecretReference {
  namespace: string;
  name: string;
  version?: string;
}

export interface SecretAccessRequest {
  actorId: string;
  purpose: string;
  reference: SecretReference;
}

const SAFE_SEGMENT = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;

function requireSegment(value: string, field: string): string {
  const normalized = value.trim();
  if (!SAFE_SEGMENT.test(normalized)) {
    throw new Error(`${field} must be a safe identifier segment`);
  }
  return normalized;
}

export function normalizeSecretReference(input: SecretReference): SecretReference {
  return {
    namespace: requireSegment(input.namespace, "namespace"),
    name: requireSegment(input.name, "name"),
    ...(input.version ? { version: requireSegment(input.version, "version") } : {}),
  };
}

export function secretReferenceKey(input: SecretReference): string {
  const reference = normalizeSecretReference(input);
  return [reference.namespace, reference.name, reference.version ?? "latest"].join(":");
}

export function createSecretAccessEvent(request: SecretAccessRequest) {
  const actorId = requireSegment(request.actorId, "actorId");
  const purpose = request.purpose.trim();
  if (!purpose || purpose.length > 256) throw new Error("purpose is required and must be <= 256 characters");
  const reference = normalizeSecretReference(request.reference);

  return {
    type: "sky.secrets.access.requested.v1" as const,
    actorId,
    purpose,
    reference,
    referenceKey: secretReferenceKey(reference),
  };
}

export function redactSecretValue<T extends Record<string, unknown>>(record: T): T {
  const blocked = new Set(["secret", "value", "token", "password", "authorization", "privatekey", "private_key"]);
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, blocked.has(key.toLowerCase()) ? "[REDACTED]" : value]),
  ) as T;
}
