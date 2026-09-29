export type DonationStatus = "pledged" | "recorded" | "cancelled";

export interface DonationInput {
  id: string;
  donorId: string;
  campaignId: string;
  amountMinor: number;
  currency: string;
  createdAt: string;
}

export interface DonationRecord extends DonationInput {
  status: DonationStatus;
}

export interface DonationAcknowledgement {
  contract: "skyhope.donation.acknowledgement.v1";
  donationId: string;
  campaignId: string;
  amountMinor: number;
  currency: string;
  status: DonationStatus;
  paymentExecutedBySkycoin4444: false;
  settlementVerified: false;
  taxReceipt: false;
}

export interface DonationLedgerSnapshot {
  records: readonly DonationRecord[];
  idempotencyEntries: number;
  persistencePerformed: false;
  externalPaymentExecutionPerformed: false;
}

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const SAFE_KEY = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const MAX_LEDGER_RECORDS = 10_000;

function requiredText(value: string, field: string, max = 120): void {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.length > max
  ) {
    throw new TypeError(
      `${field} must be a non-empty string of at most ${max} characters`,
    );
  }
}

function strictTimestamp(value: string): void {
  if (typeof value !== "string" || !ISO_UTC.test(value)) {
    throw new TypeError("createdAt must be an ISO-8601 UTC timestamp");
  }
  const parsed = new Date(value);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 19) !== value.slice(0, 19)
  ) {
    throw new TypeError("createdAt must be a valid calendar timestamp");
  }
}

function validateRecord(record: DonationRecord): void {
  requiredText(record.id, "id");
  requiredText(record.donorId, "donorId");
  requiredText(record.campaignId, "campaignId");
  if (
    !Number.isSafeInteger(record.amountMinor) ||
    record.amountMinor <= 0
  ) {
    throw new RangeError("amountMinor must be a positive safe integer");
  }
  if (!/^[A-Z]{3}$/.test(record.currency)) {
    throw new TypeError("currency must be a three-letter uppercase code");
  }
  strictTimestamp(record.createdAt);
  if (!["pledged", "recorded", "cancelled"].includes(record.status)) {
    throw new TypeError("unsupported donation status");
  }
}

function cloneRecord(record: DonationRecord): DonationRecord {
  validateRecord(record);
  return { ...record };
}

function fingerprint(input: DonationInput): string {
  return JSON.stringify([
    input.id,
    input.donorId,
    input.campaignId,
    input.amountMinor,
    input.currency,
    input.createdAt,
  ]);
}

function validateIdempotencyKey(value: string): string {
  if (typeof value !== "string" || !SAFE_KEY.test(value)) {
    throw new TypeError("idempotencyKey must be a bounded identifier");
  }
  return value;
}

export function createDonation(input: DonationInput): DonationRecord {
  const record: DonationRecord = { ...input, status: "pledged" };
  validateRecord(record);
  return record;
}

export function markRecorded(record: DonationRecord): DonationRecord {
  validateRecord(record);
  if (record.status !== "pledged") {
    throw new Error("only pledged donations can be recorded");
  }
  return { ...record, status: "recorded" };
}

export function cancelDonation(record: DonationRecord): DonationRecord {
  validateRecord(record);
  if (record.status === "recorded") {
    throw new Error("recorded donations cannot be cancelled by this domain core");
  }
  if (record.status === "cancelled") return record;
  return { ...record, status: "cancelled" };
}

export interface DonationIntegrationEvent {
  type: "skyhope.donation.recorded";
  donationId: string;
  campaignId: string;
  amountMinor: number;
  currency: string;
}

export function toIntegrationEvent(
  record: DonationRecord,
): DonationIntegrationEvent {
  validateRecord(record);
  if (record.status !== "recorded") {
    throw new Error("only recorded donations emit an integration event");
  }
  return {
    type: "skyhope.donation.recorded",
    donationId: record.id,
    campaignId: record.campaignId,
    amountMinor: record.amountMinor,
    currency: record.currency,
  };
}

export function createDonationAcknowledgement(
  record: DonationRecord,
): DonationAcknowledgement {
  validateRecord(record);
  return Object.freeze({
    contract: "skyhope.donation.acknowledgement.v1" as const,
    donationId: record.id,
    campaignId: record.campaignId,
    amountMinor: record.amountMinor,
    currency: record.currency,
    status: record.status,
    paymentExecutedBySkycoin4444: false as const,
    settlementVerified: false as const,
    taxReceipt: false as const,
  });
}

export class DonationLedger {
  readonly #records = new Map<string, DonationRecord>();
  readonly #idempotency = new Map<
    string,
    { fingerprint: string; donationId: string }
  >();

  pledge(input: DonationInput, idempotencyKey: string): DonationRecord {
    const key = validateIdempotencyKey(idempotencyKey);
    const inputFingerprint = fingerprint(input);
    const replay = this.#idempotency.get(key);
    if (replay) {
      if (replay.fingerprint !== inputFingerprint) {
        throw new Error("idempotency key reused with different donation input");
      }
      const existing = this.#records.get(replay.donationId);
      if (!existing) throw new Error("idempotency record is inconsistent");
      return cloneRecord(existing);
    }

    if (this.#records.size >= MAX_LEDGER_RECORDS) {
      throw new RangeError(`donation ledger capacity ${MAX_LEDGER_RECORDS} reached`);
    }
    if (this.#records.has(input.id)) {
      throw new Error("donation id already exists");
    }

    const record = createDonation(input);
    this.#records.set(record.id, cloneRecord(record));
    this.#idempotency.set(key, {
      fingerprint: inputFingerprint,
      donationId: record.id,
    });
    return cloneRecord(record);
  }

  markRecorded(donationId: string): DonationRecord {
    requiredText(donationId, "donationId");
    const current = this.#records.get(donationId);
    if (!current) throw new Error("donation not found");
    const next = markRecorded(current);
    this.#records.set(next.id, cloneRecord(next));
    return cloneRecord(next);
  }

  cancel(donationId: string): DonationRecord {
    requiredText(donationId, "donationId");
    const current = this.#records.get(donationId);
    if (!current) throw new Error("donation not found");
    const next = cancelDonation(current);
    this.#records.set(next.id, cloneRecord(next));
    return cloneRecord(next);
  }

  get(donationId: string): DonationRecord | undefined {
    requiredText(donationId, "donationId");
    const record = this.#records.get(donationId);
    return record ? cloneRecord(record) : undefined;
  }

  listForCampaign(campaignId: string): DonationRecord[] {
    requiredText(campaignId, "campaignId");
    return [...this.#records.values()]
      .filter(record => record.campaignId === campaignId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
      .map(cloneRecord);
  }

  snapshot(): DonationLedgerSnapshot {
    return Object.freeze({
      records: Object.freeze(
        [...this.#records.values()]
          .sort((left, right) => left.id.localeCompare(right.id))
          .map(record => Object.freeze(cloneRecord(record))),
      ),
      idempotencyEntries: this.#idempotency.size,
      persistencePerformed: false as const,
      externalPaymentExecutionPerformed: false as const,
    });
  }
}
