export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

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

export function validateCampaign(campaign: Campaign): string[] {
  const errors: string[] = [];
  if (!campaign.id.trim()) errors.push("id is required");
  if (!campaign.title.trim()) errors.push("title is required");
  if (!Number.isSafeInteger(campaign.goalMinor) || campaign.goalMinor <= 0) errors.push("goalMinor must be a positive safe integer");
  if (!Number.isSafeInteger(campaign.raisedMinor) || campaign.raisedMinor < 0) errors.push("raisedMinor must be a non-negative safe integer");
  if (!/^[A-Z]{3}$/.test(campaign.currency)) errors.push("currency must be a 3-letter uppercase code");
  return errors;
}

export function evaluateContribution(campaign: Campaign, intent: ContributionIntent): ContributionResult {
  if (campaign.status !== "active") {
    return { accepted: false, reason: "campaign-not-active", projectedRaisedMinor: campaign.raisedMinor };
  }
  if (campaign.id !== intent.campaignId) {
    return { accepted: false, reason: "campaign-mismatch", projectedRaisedMinor: campaign.raisedMinor };
  }
  if (campaign.currency !== intent.currency) {
    return { accepted: false, reason: "currency-mismatch", projectedRaisedMinor: campaign.raisedMinor };
  }
  if (!Number.isSafeInteger(intent.amountMinor) || intent.amountMinor <= 0) {
    return { accepted: false, reason: "invalid-amount", projectedRaisedMinor: campaign.raisedMinor };
  }
  if (!intent.idempotencyKey.trim()) {
    return { accepted: false, reason: "idempotency-key-required", projectedRaisedMinor: campaign.raisedMinor };
  }
  const projected = campaign.raisedMinor + intent.amountMinor;
  if (!Number.isSafeInteger(projected)) {
    return { accepted: false, reason: "amount-overflow", projectedRaisedMinor: campaign.raisedMinor };
  }
  return { accepted: true, projectedRaisedMinor: projected };
}

export function completionPercent(campaign: Campaign): number {
  if (campaign.goalMinor <= 0) return 0;
  return Math.min(100, Math.round((campaign.raisedMinor / campaign.goalMinor) * 10000) / 100);
}
