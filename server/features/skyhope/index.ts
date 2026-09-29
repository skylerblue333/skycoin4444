import { evaluateContribution, type Campaign } from "../fundraising";

export type SkyHopeEvidenceLevel = "demo-catalog";
export type SkyHopeCampaignStatus = "open" | "paused" | "complete";

export interface SkyHopeCampaign {
  id: string;
  title: string;
  summary: string;
  category: "Food security" | "Education" | "Housing";
  goalMinor: number;
  pledgedMinor: number;
  currency: "USD";
  status: SkyHopeCampaignStatus;
  evidenceLevel: SkyHopeEvidenceLevel;
  fundUsePlan: readonly string[];
  impactMetric: {
    label: string;
    target: number;
    unit: string;
  };
}

export interface SkyHopeVolunteerOpportunity {
  id: string;
  title: string;
  category: SkyHopeCampaign["category"];
  commitment: string;
  mode: "local-coordinator-required";
  summary: string;
  evidenceLevel: SkyHopeEvidenceLevel;
}

export interface SkyHopePledgePlanInput {
  campaignId: string;
  supporterId: string;
  amountMinor: number;
  idempotencyKey: string;
}

export interface SkyHopePledgePlan {
  contract: "skyhope.pledge-plan.v1";
  accepted: boolean;
  reason?: string;
  campaignId: string;
  amountMinor: number;
  currency: "USD";
  projectedPledgedMinor: number;
  paymentCollected: false;
  donationPersisted: false;
  externalSettlementExecuted: false;
  blockchainTransactionBroadcast: false;
  providerRequiredForSettlement: true;
}

const campaignCatalog: readonly SkyHopeCampaign[] = [
  {
    id: "demo-food-kits",
    title: "Community Food Kit Demo",
    summary:
      "Demonstration campaign for testing transparent budgeting, pledge planning, and progress UX around food-security support.",
    category: "Food security",
    goalMinor: 2500000,
    pledgedMinor: 875000,
    currency: "USD",
    status: "open",
    evidenceLevel: "demo-catalog",
    fundUsePlan: [
      "55% shelf-stable food and household staples",
      "25% local packing and distribution materials",
      "20% contingency, accessibility, and reporting",
    ],
    impactMetric: { label: "planned household kits", target: 500, unit: "kits" },
  },
  {
    id: "demo-student-devices",
    title: "Student Device Access Demo",
    summary:
      "Demonstration campaign for validating education-impact goals, milestone reporting, and non-settling supporter pledges.",
    category: "Education",
    goalMinor: 4000000,
    pledgedMinor: 1460000,
    currency: "USD",
    status: "open",
    evidenceLevel: "demo-catalog",
    fundUsePlan: [
      "70% refurbished laptops and protective cases",
      "20% accessibility peripherals and connectivity support",
      "10% inventory, setup, and evidence collection",
    ],
    impactMetric: { label: "planned learner device packages", target: 160, unit: "packages" },
  },
  {
    id: "demo-shelter-supplies",
    title: "Shelter Supply Readiness Demo",
    summary:
      "Demonstration campaign for testing emergency-supply planning and evidence-aware reporting without claiming a live beneficiary relationship.",
    category: "Housing",
    goalMinor: 3000000,
    pledgedMinor: 930000,
    currency: "USD",
    status: "open",
    evidenceLevel: "demo-catalog",
    fundUsePlan: [
      "50% bedding, hygiene, and weather-ready supplies",
      "30% transportation and storage planning",
      "20% accessibility, contingency, and reporting",
    ],
    impactMetric: { label: "planned supply sets", target: 300, unit: "sets" },
  },
];

const volunteerCatalog: readonly SkyHopeVolunteerOpportunity[] = [
  {
    id: "demo-food-packing",
    title: "Food-kit packing workflow",
    category: "Food security",
    commitment: "Example: 2-hour shift",
    mode: "local-coordinator-required",
    summary:
      "Product example for testing signup and scheduling UX. A verified local organizer is required before this can become a live opportunity.",
    evidenceLevel: "demo-catalog",
  },
  {
    id: "demo-tech-tutoring",
    title: "Student technology tutoring workflow",
    category: "Education",
    commitment: "Example: 1 hour per week",
    mode: "local-coordinator-required",
    summary:
      "Product example for testing interest capture and skills matching. No student contact is created by this beta surface.",
    evidenceLevel: "demo-catalog",
  },
  {
    id: "demo-supply-sorting",
    title: "Shelter supply sorting workflow",
    category: "Housing",
    commitment: "Example: 90-minute shift",
    mode: "local-coordinator-required",
    summary:
      "Product example for volunteer coordination UX. Live location, beneficiary, and scheduling data require a verified organizer integration.",
    evidenceLevel: "demo-catalog",
  },
];

function cloneCampaign(campaign: SkyHopeCampaign): SkyHopeCampaign {
  return {
    ...campaign,
    fundUsePlan: [...campaign.fundUsePlan],
    impactMetric: { ...campaign.impactMetric },
  };
}

export function listSkyHopeCampaigns(category?: string): SkyHopeCampaign[] {
  const normalized = category?.trim().toLowerCase();
  return campaignCatalog
    .filter(campaign => !normalized || campaign.category.toLowerCase() === normalized)
    .map(cloneCampaign);
}

export function listSkyHopeVolunteerOpportunities(): SkyHopeVolunteerOpportunity[] {
  return volunteerCatalog.map(opportunity => ({ ...opportunity }));
}

export function getSkyHopeStats() {
  const openCampaigns = campaignCatalog.filter(campaign => campaign.status === "open");
  return {
    contract: "skyhope.stats.v1" as const,
    catalogMode: "demonstration" as const,
    activeCampaigns: openCampaigns.length,
    totalCampaigns: campaignCatalog.length,
    plannedGoalMinor: openCampaigns.reduce((sum, campaign) => sum + campaign.goalMinor, 0),
    plannedPledgedMinor: openCampaigns.reduce((sum, campaign) => sum + campaign.pledgedMinor, 0),
    volunteerExamples: volunteerCatalog.length,
    paymentExecutionEnabled: false as const,
  };
}

function toFundraisingCampaign(campaign: SkyHopeCampaign): Campaign {
  return {
    id: campaign.id,
    title: campaign.title,
    goalMinor: campaign.goalMinor,
    raisedMinor: campaign.pledgedMinor,
    currency: campaign.currency,
    status:
      campaign.status === "open"
        ? "active"
        : campaign.status === "paused"
          ? "paused"
          : "completed",
  };
}

export function planSkyHopePledge(input: SkyHopePledgePlanInput): SkyHopePledgePlan {
  const campaign = campaignCatalog.find(candidate => candidate.id === input.campaignId);
  if (!campaign) {
    return {
      contract: "skyhope.pledge-plan.v1",
      accepted: false,
      reason: "campaign-not-found",
      campaignId: input.campaignId,
      amountMinor: input.amountMinor,
      currency: "USD",
      projectedPledgedMinor: 0,
      paymentCollected: false,
      donationPersisted: false,
      externalSettlementExecuted: false,
      blockchainTransactionBroadcast: false,
      providerRequiredForSettlement: true,
    };
  }

  const result = evaluateContribution(toFundraisingCampaign(campaign), {
    campaignId: campaign.id,
    contributorId: input.supporterId,
    amountMinor: input.amountMinor,
    currency: campaign.currency,
    idempotencyKey: input.idempotencyKey,
  });

  return {
    contract: "skyhope.pledge-plan.v1",
    accepted: result.accepted,
    reason: result.reason,
    campaignId: campaign.id,
    amountMinor: input.amountMinor,
    currency: campaign.currency,
    projectedPledgedMinor: result.projectedRaisedMinor,
    paymentCollected: false,
    donationPersisted: false,
    externalSettlementExecuted: false,
    blockchainTransactionBroadcast: false,
    providerRequiredForSettlement: true,
  };
}

export const SKYHOPE_BETA_BOUNDARY = {
  contract: "skyhope.boundary.v1",
  catalogMode: "demonstration",
  verifiesNonprofits: false,
  executesPayments: false,
  persistsDonations: false,
  issuesReceipts: false,
  holdsCustody: false,
  transfersTokens: false,
  broadcastsBlockchainTransactions: false,
  provesExternalImpact: false,
  requiresVerifiedProviderForRealDonation: true,
} as const;
