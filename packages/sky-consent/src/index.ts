export type ConsentPurpose =
  "essential" | "analytics" | "personalization" | "marketing" | "ai_training";

export type ConsentState = "granted" | "denied";
export type ConsentSource = "user" | "admin" | "migration";

export interface ConsentRecord {
  subjectId: string;
  purpose: ConsentPurpose;
  state: ConsentState;
  policyVersion: string;
  recordedAt: string;
  source: ConsentSource;
}

export interface ConsentDecision {
  allowed: boolean;
  reason: "essential" | "granted" | "denied" | "missing" | "stale_policy";
}

const SUBJECT_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const POLICY_VERSION = /^[A-Za-z0-9][A-Za-z0-9._-]{0,31}$/;
const CANONICAL_UTC_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const CONSENT_PURPOSES = new Set<ConsentPurpose>([
  "essential",
  "analytics",
  "personalization",
  "marketing",
  "ai_training",
]);
const CONSENT_STATES = new Set<ConsentState>(["granted", "denied"]);
const CONSENT_SOURCES = new Set<ConsentSource>(["user", "admin", "migration"]);

function assertCanonicalUtcInstant(value: string): void {
  if (!CANONICAL_UTC_INSTANT.test(value)) {
    throw new Error("invalid recordedAt");
  }

  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) {
    throw new Error("invalid recordedAt");
  }
}

function compareNewestFirst(a: ConsentRecord, b: ConsentRecord): number {
  if (a.recordedAt === b.recordedAt) return 0;
  return a.recordedAt > b.recordedAt ? -1 : 1;
}

export function validateConsentRecord(record: ConsentRecord): ConsentRecord {
  if (!SUBJECT_ID.test(record.subjectId)) {
    throw new Error("invalid subjectId");
  }
  if (!CONSENT_PURPOSES.has(record.purpose)) {
    throw new Error("invalid purpose");
  }
  if (!CONSENT_STATES.has(record.state)) {
    throw new Error("invalid state");
  }
  if (!POLICY_VERSION.test(record.policyVersion)) {
    throw new Error("invalid policyVersion");
  }
  assertCanonicalUtcInstant(record.recordedAt);
  if (!CONSENT_SOURCES.has(record.source)) {
    throw new Error("invalid source");
  }
  return { ...record };
}

export function decideConsent(
  purpose: ConsentPurpose,
  currentPolicyVersion: string,
  records: readonly ConsentRecord[]
): ConsentDecision {
  if (!CONSENT_PURPOSES.has(purpose)) {
    throw new Error("invalid purpose");
  }
  if (!POLICY_VERSION.test(currentPolicyVersion)) {
    throw new Error("invalid policyVersion");
  }
  if (purpose === "essential") {
    return { allowed: true, reason: "essential" };
  }

  const relevant = records
    .filter(record => record.purpose === purpose)
    .map(validateConsentRecord)
    .sort(compareNewestFirst);

  const latest = relevant[0];
  if (!latest) return { allowed: false, reason: "missing" };
  if (latest.policyVersion !== currentPolicyVersion) {
    return { allowed: false, reason: "stale_policy" };
  }
  return latest.state === "granted"
    ? { allowed: true, reason: "granted" }
    : { allowed: false, reason: "denied" };
}

export function latestConsentByPurpose(
  records: readonly ConsentRecord[]
): Partial<Record<ConsentPurpose, ConsentRecord>> {
  const result: Partial<Record<ConsentPurpose, ConsentRecord>> = {};
  for (const raw of records) {
    const record = validateConsentRecord(raw);
    const prior = result[record.purpose];
    if (!prior || record.recordedAt > prior.recordedAt) {
      result[record.purpose] = record;
    }
  }
  return result;
}
