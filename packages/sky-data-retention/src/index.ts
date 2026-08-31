export interface RetentionPolicy {
  category: string;
  retainForMs: number;
}

export interface RetentionRecord {
  category: string;
  createdAtMs: number;
  legalHold?: boolean;
}

const CATEGORY = /^[A-Za-z][A-Za-z0-9._:-]{0,127}$/;

export function shouldRetain(
  record: RetentionRecord,
  policy: RetentionPolicy,
  nowMs: number
): boolean {
  if (!CATEGORY.test(record.category) || !CATEGORY.test(policy.category)) {
    throw new Error("invalid category");
  }
  if (record.category !== policy.category) throw new Error("category mismatch");
  if (!Number.isSafeInteger(record.createdAtMs) || record.createdAtMs < 0) {
    throw new Error("invalid createdAtMs");
  }
  if (!Number.isSafeInteger(policy.retainForMs) || policy.retainForMs < 0) {
    throw new Error("invalid retainForMs");
  }
  if (!Number.isSafeInteger(nowMs) || nowMs < record.createdAtMs) {
    throw new Error("invalid nowMs");
  }
  if (record.legalHold === true) return true;
  return nowMs - record.createdAtMs < policy.retainForMs;
}
