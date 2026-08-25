export interface ReconciliationRecord {
  id: string;
  externalRef: string;
  amountMinor: number;
  currency: string;
}

export type ReconciliationStatus = "matched" | "amount_mismatch" | "missing_external" | "duplicate_external_ref";

export interface ReconciliationResult {
  recordId: string;
  status: ReconciliationStatus;
  externalId?: string;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const CURRENCY = /^[A-Z]{3}$/;

export function validateRecord(record: ReconciliationRecord): ReconciliationRecord {
  if (!ID.test(record.id) || !ID.test(record.externalRef)) throw new Error("invalid identifier");
  if (!Number.isSafeInteger(record.amountMinor)) throw new Error("amountMinor must be a safe integer");
  if (!CURRENCY.test(record.currency)) throw new Error("invalid currency");
  return { ...record };
}

export function reconcile(
  internal: readonly ReconciliationRecord[],
  external: readonly ReconciliationRecord[],
): ReconciliationResult[] {
  const extByRef = new Map<string, ReconciliationRecord[]>();
  for (const raw of external) {
    const item = validateRecord(raw);
    const bucket = extByRef.get(item.externalRef) ?? [];
    bucket.push(item);
    extByRef.set(item.externalRef, bucket);
  }

  return internal.map((raw) => {
    const item = validateRecord(raw);
    const matches = extByRef.get(item.externalRef) ?? [];
    if (matches.length === 0) return { recordId: item.id, status: "missing_external" };
    if (matches.length > 1) return { recordId: item.id, status: "duplicate_external_ref" };
    const match = matches[0]!;
    if (match.amountMinor !== item.amountMinor || match.currency !== item.currency) {
      return { recordId: item.id, status: "amount_mismatch", externalId: match.id };
    }
    return { recordId: item.id, status: "matched", externalId: match.id };
  });
}

export function reconciliationSummary(results: readonly ReconciliationResult[]): Record<ReconciliationStatus, number> {
  const summary: Record<ReconciliationStatus, number> = {
    matched: 0,
    amount_mismatch: 0,
    missing_external: 0,
    duplicate_external_ref: 0,
  };
  for (const result of results) summary[result.status] += 1;
  return summary;
}
