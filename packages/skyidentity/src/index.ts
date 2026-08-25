import { createHash } from "node:crypto";

const SKY_ID_RE = /^skyid_[a-f0-9]{32}$/;
const SUBJECT_RE = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,127}$/;
const NAMESPACE_RE = /^[a-z][a-z0-9-]{1,31}$/;

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
    throw new Error("namespace must be 2-32 lowercase alphanumeric/hyphen characters and start with a letter");
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

export function createIdentityRecord(
  input: IdentitySubject & { createdAt: string; displayName?: string },
): IdentityRecord {
  const createdAt = new Date(input.createdAt);
  if (Number.isNaN(createdAt.getTime())) {
    throw new Error("createdAt must be a valid ISO-compatible timestamp");
  }

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

export function matchesSubject(record: IdentityRecord, input: IdentitySubject): boolean {
  return record.id === deriveIdentityId(input);
}
