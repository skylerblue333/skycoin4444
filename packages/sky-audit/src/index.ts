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

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
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
  if (day < 1 || day > daysInMonth(year, month)) {
    throw new Error("occurredAt must be a real ISO date-time");
  }

  if (zone !== "Z" && zone !== "z") {
    const [offsetHourText, offsetMinuteText] = zone.slice(1).split(":");
    const offsetHour = Number(offsetHourText);
    const offsetMinute = Number(offsetMinuteText);
    if (offsetHour > 23 || offsetMinute > 59) {
      throw new Error("occurredAt must contain a valid UTC offset");
    }
  }

  const milliseconds = Date.parse(normalized);
  if (!Number.isFinite(milliseconds)) throw new Error("occurredAt must be an ISO date-time");
  return new Date(milliseconds).toISOString();
}

function normalizeMetadata(
  metadata: Record<string, string | number | boolean> | undefined,
): Array<[string, string | number | boolean]> {
  return Object.entries(metadata ?? {})
    .map(([key, value]) => {
      if (typeof value === "number" && !Number.isFinite(value)) {
        throw new Error(`metadata.${key} must be a finite number`);
      }
      return [key, value] as [string, string | number | boolean];
    })
    .sort(([left], [right]) => compareCodeUnits(left, right));
}

export function canonicalizeAudit(input: AuditInput): string {
  const actorId = requireText(input.actorId, "actorId");
  const action = requireText(input.action, "action");
  const resource = requireText(input.resource, "resource");
  const occurredAt = parseInstant(input.occurredAt);
  const metadata = normalizeMetadata(input.metadata);
  return JSON.stringify({
    actorId,
    action,
    resource,
    occurredAt,
    severity: input.severity ?? "info",
    metadata,
  });
}

function deterministicAuditHash(canonical: string): number {
  let hash = 2166136261;
  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= canonical.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createAuditRecord(input: AuditInput): AuditRecord {
  const canonical = canonicalizeAudit(input);
  return {
    ...input,
    actorId: input.actorId.trim(),
    action: input.action.trim(),
    resource: input.resource.trim(),
    occurredAt: parseInstant(input.occurredAt),
    severity: input.severity ?? "info",
    id: `aud_${deterministicAuditHash(canonical).toString(16).padStart(8, "0")}`,
    canonical,
  };
}

function sensitiveKeyParts(key: string): { compact: string; words: string[] } {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  const words = spaced.split(/[^a-z0-9]+/).filter(Boolean);
  return { compact: words.join(""), words };
}

export function redactAuditMetadata(
  metadata: Record<string, unknown>,
  blockedKeys = ["password", "token", "secret", "authorization"],
): Record<string, unknown> {
  const blocked = blockedKeys.map(key => sensitiveKeyParts(key));
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      const candidate = sensitiveKeyParts(key);
      const shouldRedact = blocked.some(blockedKey =>
        candidate.compact === blockedKey.compact ||
        blockedKey.words.some(word => candidate.words.includes(word)),
      );
      return [key, shouldRedact ? "[REDACTED]" : value];
    }),
  );
}
