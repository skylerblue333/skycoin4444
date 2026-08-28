import { createHash } from "node:crypto";

const SKY_ID_RE = /^skyid_[a-f0-9]{32}$/;
const SUBJECT_RE = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,127}$/;
const NAMESPACE_RE = /^[a-z][a-z0-9-]{1,31}$/;
const ISO_TIMESTAMP_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

export type SkyIdentityId = `skyid_${string}`;

export interface IdentitySubject {
  namespace: string;
  subject: string;
}

export interface IdentityRecord extends IdentitySubject {
  id: SkyIdentityId;
  createdAt: string;
  displayName?: string;
}

export function normalizeNamespace(value: string): string {
  const namespace = value.trim().toLowerCase();
  if (!NAMESPACE_RE.test(namespace)) {
    throw new Error(
      "namespace must be 2-32 lowercase alphanumeric/hyphen characters and start with a letter",
    );
  }
  return namespace;
}

export function normalizeSubject(value: string): string {
  const subject = value.trim();
  if (!SUBJECT_RE.test(subject)) {
    throw new Error("subject must be 1-128 safe identifier characters");
  }
  return subject;
}

export function deriveIdentityId(input: IdentitySubject): SkyIdentityId {
  const namespace = normalizeNamespace(input.namespace);
  const subject = normalizeSubject(input.subject);
  const digest = createHash("sha256")
    .update(`${namespace}\u0000${subject}`, "utf8")
    .digest("hex")
    .slice(0, 32);
  return `skyid_${digest}` as SkyIdentityId;
}

export function isSkyIdentityId(value: unknown): value is SkyIdentityId {
  return typeof value === "string" && SKY_ID_RE.test(value);
}

function parseStrictTimestamp(value: string): Date {
  if (!ISO_TIMESTAMP_RE.test(value)) {
    throw new Error("createdAt must be an ISO-8601 timestamp with timezone");
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("createdAt must be a valid ISO-8601 timestamp");
  }

  const wallClockMatch = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
  );
  if (!wallClockMatch) {
    throw new Error("createdAt must be a valid ISO-8601 timestamp");
  }
  const [, year, month, day, hour, minute, second] = wallClockMatch;
  const offsetMatch = value.match(/(Z|[+-]\d{2}:\d{2})$/);
  if (!offsetMatch) {
    throw new Error("createdAt must include a timezone");
  }
  const normalized = offsetMatch[1] === "Z" ? "+00:00" : offsetMatch[1];
  const sign = normalized[0] === "+" ? 1 : -1;
  const [offsetHours, offsetMinutes] = normalized
    .slice(1)
    .split(":")
    .map(Number);
  if (offsetHours > 23 || offsetMinutes > 59) {
    throw new Error("createdAt has an invalid timezone offset");
  }
  const offsetMs = sign * (offsetHours * 60 + offsetMinutes) * 60_000;
  const local = new Date(parsed.getTime() + offsetMs);
  if (
    local.getUTCFullYear() !== Number(year) ||
    local.getUTCMonth() + 1 !== Number(month) ||
    local.getUTCDate() !== Number(day) ||
    local.getUTCHours() !== Number(hour) ||
    local.getUTCMinutes() !== Number(minute) ||
    local.getUTCSeconds() !== Number(second)
  ) {
    throw new Error("createdAt contains an impossible calendar date or time");
  }
  return parsed;
}

export function createIdentityRecord(
  input: IdentitySubject & { createdAt: string; displayName?: string },
): IdentityRecord {
  const createdAt = parseStrictTimestamp(input.createdAt);

  const displayName = input.displayName?.trim();
  if (displayName && displayName.length > 120) {
    throw new Error("displayName must not exceed 120 characters");
  }

  const namespace = normalizeNamespace(input.namespace);
  const subject = normalizeSubject(input.subject);
  return {
    id: deriveIdentityId({ namespace, subject }),
    namespace,
    subject,
    createdAt: createdAt.toISOString(),
    ...(displayName ? { displayName } : {}),
  };
}

export function matchesSubject(
  record: IdentityRecord,
  input: IdentitySubject,
): boolean {
  return record.id === deriveIdentityId(input);
}
