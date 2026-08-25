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

function requiredText(value: string, field: string, max = 120): void {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > max) {
    throw new TypeError(`${field} must be a non-empty string of at most ${max} characters`);
  }
}

export function createDonation(input: DonationInput): DonationRecord {
  requiredText(input.id, "id");
  requiredText(input.donorId, "donorId");
  requiredText(input.campaignId, "campaignId");
  if (!Number.isSafeInteger(input.amountMinor) || input.amountMinor <= 0) {
    throw new RangeError("amountMinor must be a positive safe integer");
  }
  if (!/^[A-Z]{3}$/.test(input.currency)) {
    throw new TypeError("currency must be a three-letter uppercase code");
  }
  if (!Number.isFinite(Date.parse(input.createdAt))) {
    throw new TypeError("createdAt must be a valid timestamp");
  }
  return { ...input, status: "pledged" };
}

export function markRecorded(record: DonationRecord): DonationRecord {
  if (record.status !== "pledged") throw new Error("only pledged donations can be recorded");
  return { ...record, status: "recorded" };
}

export function cancelDonation(record: DonationRecord): DonationRecord {
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
  if (record.status !== "recorded") throw new Error("only recorded donations emit an integration event");
  return {
    type: "skyhope.donation.recorded",
    donationId: record.id,
    campaignId: record.campaignId,
    amountMinor: record.amountMinor,
    currency: record.currency,
  };
}
