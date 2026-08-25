export type ConsentPurpose =
  | "essential"
  | "analytics"
  | "personalization"
  | "marketing"
  | "ai_training";

export type ConsentState = "granted" | "denied";

export interface ConsentRecord {
  subjectId: string;
  purpose: ConsentPurpose;
  state: ConsentState;
  policyVersion: string;
  recordedAt: string;
  source: "user" | "admin" | "migration";
}

export interface ConsentDecision {
  allowed: boolean;
  reason: "essential" | "granted" | "denied" | "missing" | "stale_policy";
}

const SUBJECT_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const POLICY_VERSION = /^[A-Za-z0-9][A-Za-z0-9._-]{0,31}$/;

export function validateConsentRecord(record: ConsentRecord): ConsentRecord {
  if (!SUBJECT_ID.test(record.subjectId)) {
    throw new Error("invalid subjectId");
  }
  if (!POLICY_VERSION.test(record.policyVersion)) {
    throw new Error("invalid policyVersion");
  }
  if (!Number.isFinite(Date.parse(record.recordedAt))) {
    throw new Error("invalid recordedAt");
  }
  return { ...record };
}

export function decideConsent(
  purpose: ConsentPurpose,
  currentPolicyVersion: string,
  records: readonly ConsentRecord[],
): ConsentDecision {
  if (!POLICY_VERSION.test(currentPolicyVersion)) {
    throw new Error("invalid policyVersion");
  }
  if (purpose === "essential") {
    return { allowed: true, reason: "essential" };
  }

  const relevant = records
    .filter((record) => record.purpose === purpose)
    .map(validateConsentRecord)
    .sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt));

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
  records: readonly ConsentRecord[],
): Partial<Record<ConsentPurpose, ConsentRecord>> {
  const result: Partial<Record<ConsentPurpose, ConsentRecord>> = {};
  for (const raw of records) {
    const record = validateConsentRecord(raw);
    const prior = result[record.purpose];
    if (
      !prior ||
      Date.parse(record.recordedAt) > Date.parse(prior.recordedAt)
    ) {
      result[record.purpose] = record;
    }
  }
  return result;
}
