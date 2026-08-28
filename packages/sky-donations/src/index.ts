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

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function requiredText(value: string, field: string, max = 120): void {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > max) {
    throw new TypeError(`${field} must be a non-empty string of at most ${max} characters`);
  }
}

function strictTimestamp(value: string): void {
  if (typeof value !== "string" || !ISO_UTC.test(value)) throw new TypeError("createdAt must be an ISO-8601 UTC timestamp");
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 19) !== value.slice(0, 19)) {
    throw new TypeError("createdAt must be a valid calendar timestamp");
  }
}

function validateRecord(record: DonationRecord): void {
  requiredText(record.id, "id");
  requiredText(record.donorId, "donorId");
  requiredText(record.campaignId, "campaignId");
  if (!Number.isSafeInteger(record.amountMinor) || record.amountMinor <= 0) throw new RangeError("amountMinor must be a positive safe integer");
  if (!/^[A-Z]{3}$/.test(record.currency)) throw new TypeError("currency must be a three-letter uppercase code");
  strictTimestamp(record.createdAt);
  if (!["pledged", "recorded", "cancelled"].includes(record.status)) throw new TypeError("unsupported donation status");
}

export function createDonation(input: DonationInput): DonationRecord {
  const record: DonationRecord = { ...input, status: "pledged" };
  validateRecord(record);
  return record;
}

export function markRecorded(record: DonationRecord): DonationRecord {
  validateRecord(record);
  if (record.status !== "pledged") throw new Error("only pledged donations can be recorded");
  return { ...record, status: "recorded" };
}

export function cancelDonation(record: DonationRecord): DonationRecord {
  validateRecord(record);
  if (record.status === "recorded") throw new Error("recorded donations cannot be cancelled by this domain core");
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

export function toIntegrationEvent(record: DonationRecord): DonationIntegrationEvent {
  validateRecord(record);
  if (record.status !== "recorded") throw new Error("only recorded donations emit an integration event");
  return {
    type: "skyhope.donation.recorded",
    donationId: record.id,
    campaignId: record.campaignId,
    amountMinor: record.amountMinor,
    currency: record.currency,
  };
}
