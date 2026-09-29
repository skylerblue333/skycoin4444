import { createHash } from "node:crypto";

export type CharityCampaign = Readonly<{
  id: string;
  title: string;
  description: string;
  category: "humanitarian" | "education" | "community";
  status: "planning";
  goalAmount: number;
  raisedAmount: 0;
  currency: "USD";
  demoOnly: true;
  liveFundsMoved: false;
  beneficiaryVerification: "not_connected";
}>;

export const CHARITY_CAMPAIGNS: readonly CharityCampaign[] = Object.freeze([
  Object.freeze({
    id: "clean-water-readiness",
    title: "Clean Water Access Readiness",
    description:
      "Plan beneficiary verification, provider handoff, receipts, refunds, and impact evidence before any real contribution flow is enabled.",
    category: "humanitarian",
    status: "planning",
    goalAmount: 50_000,
    raisedAmount: 0,
    currency: "USD",
    demoOnly: true,
    liveFundsMoved: false,
    beneficiaryVerification: "not_connected",
  }),
  Object.freeze({
    id: "stem-access-readiness",
    title: "STEM Access Readiness",
    description:
      "Model a future education-support campaign with explicit recipient verification, regional eligibility, and auditable provider requirements.",
    category: "education",
    status: "planning",
    goalAmount: 25_000,
    raisedAmount: 0,
    currency: "USD",
    demoOnly: true,
    liveFundsMoved: false,
    beneficiaryVerification: "not_connected",
  }),
  Object.freeze({
    id: "community-relief-readiness",
    title: "Community Relief Readiness",
    description:
      "Exercise incident-response charity planning without claiming an external charity, settlement provider, treasury, or blockchain transaction.",
    category: "community",
    status: "planning",
    goalAmount: 75_000,
    raisedAmount: 0,
    currency: "USD",
    demoOnly: true,
    liveFundsMoved: false,
    beneficiaryVerification: "not_connected",
  }),
]);

const CAMPAIGNS_BY_ID = new Map(
  CHARITY_CAMPAIGNS.map(campaign => [campaign.id, campaign] as const),
);

export const CHARITY_EXECUTION_REQUIREMENTS = Object.freeze([
  "verified beneficiary and legal entity",
  "approved external payment or settlement provider",
  "region and eligibility policy",
  "idempotent execution contract",
  "receipt and reconciliation evidence",
  "refund and failure handling",
  "auditable authorization trail",
] as const);

export type ContributionPlan = Readonly<{
  planId: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  currency: "USD";
  executionStatus: "not_executed";
  moneyMoved: false;
  blockchainWrite: false;
  custody: false;
  persistence: "request_only";
  requiresExternalProvider: true;
  requirements: readonly string[];
}>;

export function listCharityCampaigns(): readonly CharityCampaign[] {
  return CHARITY_CAMPAIGNS;
}

export function getCharityStats() {
  return Object.freeze({
    totalCampaigns: CHARITY_CAMPAIGNS.length,
    activeCampaigns: CHARITY_CAMPAIGNS.length,
    totalRaised: 0,
    totalDonors: 0,
    liveFundsRaised: 0,
    liveDonors: 0,
    executionEnabled: false,
    blockchainExecutionEnabled: false,
  });
}

export function buildContributionPlan(input: {
  campaignId: string;
  amount: number;
  actorId: string;
}): ContributionPlan {
  const campaign = CAMPAIGNS_BY_ID.get(input.campaignId);
  if (!campaign) throw new Error("unknown charity campaign");
  if (!Number.isFinite(input.amount) || input.amount <= 0 || input.amount > 100_000) {
    throw new Error("contribution planning amount must be between 0 and 100000");
  }

  const stable = [
    "skyhope-contribution-plan-v1",
    input.actorId,
    campaign.id,
    input.amount.toFixed(2),
  ].join("|");

  return Object.freeze({
    planId: createHash("sha256").update(stable).digest("hex").slice(0, 24),
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    amount: Number(input.amount.toFixed(2)),
    currency: "USD" as const,
    executionStatus: "not_executed" as const,
    moneyMoved: false as const,
    blockchainWrite: false as const,
    custody: false as const,
    persistence: "request_only" as const,
    requiresExternalProvider: true as const,
    requirements: CHARITY_EXECUTION_REQUIREMENTS,
  });
}
