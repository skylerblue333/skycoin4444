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

const ISO_INSTANT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/i;

function requireText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  if (normalized.length > 256) throw new Error(`${field} exceeds 256 characters`);
  return normalized;
}

function compareCodeUnits(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function parseInstant(value: string): string {
  const normalized = value.trim();
  const match = ISO_INSTANT.exec(normalized);
  if (!match) throw new Error("occurredAt must be an ISO date-time with an explicit UTC offset");

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, zone] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);

  if (month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) {
    throw new Error("occurredAt must be a real ISO date-time");
  }
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > daysInMonth) throw new Error("occurredAt must be a real ISO date-time");

  if (zone !== "Z" && zone !== "z") {
    const [offsetHourText, offsetMinuteText] = zone.slice(1).split(":");
    const offsetHour = Number(offsetHourText);
    const offsetMinute = Number(offsetMinuteText);
    if (offsetHour > 23 || offsetMinute > 59) throw new Error("occurredAt must contain a valid UTC offset");
  }

  const milliseconds = Date.parse(normalized);
  if (!Number.isFinite(milliseconds)) throw new Error("occurredAt must be an ISO date-time");
  return new Date(milliseconds).toISOString();
}

export function canonicalizeAudit(input: AuditInput): string {
  const actorId = requireText(input.actorId, "actorId");
  const action = requireText(input.action, "action");
  const resource = requireText(input.resource, "resource");
  const occurredAt = parseInstant(input.occurredAt);
  const metadata = Object.entries(input.metadata ?? {}).sort(([a], [b]) => compareCodeUnits(a, b));
  return JSON.stringify({ actorId, action, resource, occurredAt, severity: input.severity ?? "info", metadata });
}

export function createAuditRecord(input: AuditInput): AuditRecord {
  const canonical = canonicalizeAudit(input);
  let hash = 2166136261;
  for (const char of canonical) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return { ...input, actorId: input.actorId.trim(), action: input.action.trim(), resource: input.resource.trim(), occurredAt: parseInstant(input.occurredAt), severity: input.severity ?? "info", id: `aud_${(hash >>> 0).toString(16).padStart(8, "0")}`, canonical };
}

export function redactAuditMetadata(metadata: Record<string, unknown>, blockedKeys = ["password", "token", "secret", "authorization"]): Record<string, unknown> {
  const blocked = new Set(blockedKeys.map((key) => key.toLowerCase()));
  return Object.fromEntries(Object.entries(metadata).map(([key, value]) => [key, blocked.has(key.toLowerCase()) ? "[REDACTED]" : value]));
}
