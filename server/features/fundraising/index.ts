export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface Campaign {
  id: string;
  title: string;
  goalMinor: number;
  raisedMinor: number;
  currency: string;
  status: CampaignStatus;
  startsAt?: string;
  endsAt?: string;
}

export interface ContributionIntent {
  campaignId: string;
  contributorId: string;
  amountMinor: number;
  currency: string;
  idempotencyKey: string;
}

export interface ContributionResult {
  accepted: boolean;
  reason?: string;
  projectedRaisedMinor: number;
}

const campaignStatuses = new Set<string>([
  "draft",
  "active",
  "paused",
  "completed",
  "cancelled",
]);

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCampaign(campaign: Campaign): string[] {
  const errors: string[] = [];

  if (!campaign || typeof campaign !== "object") {
    return ["campaign is required"];
  }

  if (!isNonBlankString(campaign.id)) errors.push("id is required");
  if (!isNonBlankString(campaign.title)) errors.push("title is required");
  if (!Number.isSafeInteger(campaign.goalMinor) || campaign.goalMinor <= 0) {
    errors.push("goalMinor must be a positive safe integer");
  }
  if (
    !Number.isSafeInteger(campaign.raisedMinor) ||
    campaign.raisedMinor < 0
  ) {
    errors.push("raisedMinor must be a non-negative safe integer");
  }
  if (
    typeof campaign.currency !== "string" ||
    !/^[A-Z]{3}$/.test(campaign.currency)
  ) {
    errors.push("currency must be a 3-letter uppercase code");
  }
  if (
    typeof campaign.status !== "string" ||
    !campaignStatuses.has(campaign.status)
  ) {
    errors.push("status is invalid");
  }
  return errors;
}

export function evaluateContribution(
  campaign: Campaign,
  intent: ContributionIntent,
): ContributionResult {
  const safeRaised =
    Number.isSafeInteger(campaign?.raisedMinor) && campaign.raisedMinor >= 0
      ? campaign.raisedMinor
      : 0;

  const campaignErrors = validateCampaign(campaign);
  if (campaignErrors.length > 0) {
    return {
      accepted: false,
      reason: "invalid-campaign",
      projectedRaisedMinor: safeRaised,
    };
  }
  if (!intent || typeof intent !== "object") {
    return {
      accepted: false,
      reason: "invalid-contribution-intent",
      projectedRaisedMinor: campaign.raisedMinor,
    };
  }
  if (campaign.status !== "active") {
    return {
      accepted: false,
      reason: "campaign-not-active",
      projectedRaisedMinor: campaign.raisedMinor,
    };
  }
  if (campaign.id !== intent.campaignId) {
    return {
      accepted: false,
      reason: "campaign-mismatch",
      projectedRaisedMinor: campaign.raisedMinor,
    };
  }
  if (!isNonBlankString(intent.contributorId)) {
    return {
      accepted: false,
      reason: "contributor-id-required",
      projectedRaisedMinor: campaign.raisedMinor,
    };
  }
  if (campaign.currency !== intent.currency) {
    return {
      accepted: false,
      reason: "currency-mismatch",
      projectedRaisedMinor: campaign.raisedMinor,
    };
  }
  if (!Number.isSafeInteger(intent.amountMinor) || intent.amountMinor <= 0) {
    return {
      accepted: false,
      reason: "invalid-amount",
      projectedRaisedMinor: campaign.raisedMinor,
    };
  }
  if (!isNonBlankString(intent.idempotencyKey)) {
    return {
      accepted: false,
      reason: "idempotency-key-required",
      projectedRaisedMinor: campaign.raisedMinor,
    };
  }
  const projected = campaign.raisedMinor + intent.amountMinor;
  if (!Number.isSafeInteger(projected)) {
    return {
      accepted: false,
      reason: "amount-overflow",
      projectedRaisedMinor: campaign.raisedMinor,
    };
  }
  return { accepted: true, projectedRaisedMinor: projected };
}

export function completionPercent(campaign: Campaign): number {
  if (
    !Number.isSafeInteger(campaign?.goalMinor) ||
    campaign.goalMinor <= 0 ||
    !Number.isSafeInteger(campaign.raisedMinor) ||
    campaign.raisedMinor < 0
  ) {
    return 0;
  }
  return Math.min(
    100,
    Math.max(
      0,
      Math.round((campaign.raisedMinor / campaign.goalMinor) * 10000) / 100,
    ),
  );
}
