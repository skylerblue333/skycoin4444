export const SKYHOPE_DONATION_PREVIEW_VERSION = "skyhope-donation-preview-v1";

export type SkyHopeDonationDraft = Readonly<{
  campaignId: string;
  contributorReference: string;
  amountMajor: number;
  currency: string;
}>;

export type SkyHopeDonationPreview = Readonly<{
  campaignId: string;
  contributorReference: string;
  amountMajor: number;
  amountMinor: number;
  currency: string;
  previewReference: string;
  provenance: "deterministic-local-preview";
}>;

export type DonationPlanningChecklist = Readonly<{
  campaignReviewed: boolean;
  beneficiaryEvidenceReviewed: boolean;
  providerSelected: boolean;
  legalBoundaryReviewed: boolean;
  reconciliationPlanDefined: boolean;
}>;

export type DonationPlanningReadiness = Readonly<{
  score: number;
  readyCount: number;
  totalCount: number;
  missing: readonly string[];
}>;

const readinessLabels: ReadonlyArray<
  readonly [keyof DonationPlanningChecklist, string]
> = [
  ["campaignReviewed", "Campaign purpose and organizer details reviewed"],
  ["beneficiaryEvidenceReviewed", "Beneficiary or organization evidence reviewed"],
  ["providerSelected", "External donation/payment provider selected"],
  ["legalBoundaryReviewed", "Regional legal and eligibility boundary reviewed"],
  ["reconciliationPlanDefined", "Receipt, settlement, and reconciliation plan defined"],
] as const;

function boundedText(value: string, field: string, min: number, max: number) {
  if (typeof value !== "string") throw new TypeError(field + " must be text");
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length < min || normalized.length > max) {
    throw new RangeError(
      field + " must be between " + min + " and " + max + " characters"
    );
  }
  return normalized;
}

export function createSkyHopeDonationPreview(
  input: SkyHopeDonationDraft
): SkyHopeDonationPreview {
  if (!input || typeof input !== "object") {
    throw new TypeError("donation draft is required");
  }

  const campaignId = boundedText(input.campaignId, "campaignId", 3, 80);
  const contributorReference = boundedText(
    input.contributorReference,
    "contributorReference",
    2,
    80
  );
  const currency = boundedText(input.currency, "currency", 3, 3).toUpperCase();

  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new RangeError("currency must be a 3-letter code");
  }
  if (
    !Number.isFinite(input.amountMajor) ||
    input.amountMajor <= 0 ||
    input.amountMajor > 100_000
  ) {
    throw new RangeError("amountMajor must be greater than 0 and at most 100000");
  }

  const rawMinor = input.amountMajor * 100;
  const amountMinor = Math.round(rawMinor);
  if (Math.abs(rawMinor - amountMinor) > 1e-8) {
    throw new RangeError("amountMajor supports at most 2 decimal places");
  }
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new RangeError("amountMajor cannot be represented safely");
  }

  const amountMajor = amountMinor / 100;
  const campaignSlug = campaignId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "campaign";

  return Object.freeze({
    campaignId,
    contributorReference,
    amountMajor,
    amountMinor,
    currency,
    previewReference:
      "preview-" + campaignSlug + "-" + amountMinor + "-" + currency.toLowerCase(),
    provenance: "deterministic-local-preview",
  });
}

export function scoreDonationPlanningReadiness(
  state: DonationPlanningChecklist
): DonationPlanningReadiness {
  const ready = readinessLabels.filter(([key]) => state[key]);
  const missing = readinessLabels
    .filter(([key]) => !state[key])
    .map(([, label]) => label);

  return Object.freeze({
    score: Math.round((ready.length / readinessLabels.length) * 100),
    readyCount: ready.length,
    totalCount: readinessLabels.length,
    missing: Object.freeze(missing),
  });
}

export const donationPlanningLabels = Object.freeze(
  readinessLabels.map(([key, label]) => ({ key, label }))
);
