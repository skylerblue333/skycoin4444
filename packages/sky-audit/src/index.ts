export type AuditSeverity = "info" | "warning" | "critical";

export interface AuditInput {
  actorId: string;
  action: string;
  resource: string;
  occurredAt: string;
  severity?: AuditSeverity;
  metadata?: Record<string, string | number | boolean>;
}

export interface AuditRecord extends AuditInput {
  id: string;
  severity: AuditSeverity;
  canonical: string;
}

function requireText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  if (normalized.length > 256) throw new Error(`${field} exceeds 256 characters`);
  return normalized;
}

export function canonicalizeAudit(input: AuditInput): string {
  const actorId = requireText(input.actorId, "actorId");
  const action = requireText(input.action, "action");
  const resource = requireText(input.resource, "resource");
  const occurredAt = new Date(input.occurredAt);
  if (Number.isNaN(occurredAt.getTime())) throw new Error("occurredAt must be an ISO date-time");
  const metadata = Object.entries(input.metadata ?? {}).sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify({ actorId, action, resource, occurredAt: occurredAt.toISOString(), severity: input.severity ?? "info", metadata });
}

export function createAuditRecord(input: AuditInput): AuditRecord {
  const canonical = canonicalizeAudit(input);
  let hash = 2166136261;
  for (const char of canonical) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return { ...input, actorId: input.actorId.trim(), action: input.action.trim(), resource: input.resource.trim(), occurredAt: new Date(input.occurredAt).toISOString(), severity: input.severity ?? "info", id: `aud_${(hash >>> 0).toString(16).padStart(8, "0")}`, canonical };
}

export function redactAuditMetadata(metadata: Record<string, unknown>, blockedKeys = ["password", "token", "secret", "authorization"]): Record<string, unknown> {
  const blocked = new Set(blockedKeys.map((key) => key.toLowerCase()));
  return Object.fromEntries(Object.entries(metadata).map(([key, value]) => [key, blocked.has(key.toLowerCase()) ? "[REDACTED]" : value]));
}
