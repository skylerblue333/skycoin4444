export type TelemetryLevel = "debug" | "info" | "warn" | "error";

export interface TelemetryEvent {
  timestamp: string;
  service: string;
  level: TelemetryLevel;
  name: string;
  traceId?: string;
  attributes: Record<string, string | number | boolean>;
}

const TOKEN_RE = /^[A-Za-z][A-Za-z0-9._:-]{0,127}$/;
const TRACE_RE = /^[a-f0-9]{16,32}$/;
const BLOCKED_ATTRIBUTE = /(password|secret|token|authorization|cookie)/i;

function token(value: string, field: string): string {
  const normalized = value.trim();
  if (!TOKEN_RE.test(normalized)) throw new Error(`${field} is invalid`);
  return normalized;
}

export function sanitizeAttributes(
  attributes: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  for (const [rawKey, value] of Object.entries(attributes)) {
    const key = token(rawKey, "attribute key");
    if (BLOCKED_ATTRIBUTE.test(key)) continue;
    if (typeof value === "string") result[key] = value.slice(0, 512);
    else if (typeof value === "number" && Number.isFinite(value)) result[key] = value;
    else if (typeof value === "boolean") result[key] = value;
  }
  return result;
}

export function createTelemetryEvent(input: {
  timestamp: string;
  service: string;
  level: TelemetryLevel;
  name: string;
  traceId?: string;
  attributes?: Record<string, unknown>;
}): TelemetryEvent {
  const timestamp = new Date(input.timestamp);
  if (Number.isNaN(timestamp.getTime())) throw new Error("timestamp is invalid");
  const traceId = input.traceId?.trim().toLowerCase();
  if (traceId && !TRACE_RE.test(traceId)) throw new Error("traceId must be 16-32 lowercase hex characters");
  return {
    timestamp: timestamp.toISOString(),
    service: token(input.service, "service"),
    level: input.level,
    name: token(input.name, "name"),
    ...(traceId ? { traceId } : {}),
    attributes: sanitizeAttributes(input.attributes ?? {}),
  };
}

export function metricKey(service: string, name: string): string {
  return `${token(service, "service")}.${token(name, "metric")}`;
}
