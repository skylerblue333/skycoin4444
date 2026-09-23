export type ReadinessStatus = "available" | "needs_evidence" | "blocked";

export interface OfferingReadinessGate {
  id: string;
  title: string;
  owner: string;
  evidence: string;
  status: Exclude<ReadinessStatus, "available">;
}

export interface InvestorMetricRequirement {
  id: string;
  metric: string;
  source: string;
  period: string;
  verification: string;
}

export interface TokenAllocationDraft {
  id: string;
  label: string;
  percentage: number;
  note: string;
}

export const offeringReadinessGates: readonly OfferingReadinessGate[] = [
  {
    id: "legal",
    title: "Offering structure and jurisdiction review",
    owner: "Qualified legal/compliance counsel",
    evidence: "Written offering structure, eligible jurisdictions, transfer restrictions, disclosures, and marketing rules",
    status: "blocked",
  },
  {
    id: "contract",
    title: "Token contract and network identity",
    owner: "Protocol engineering",
    evidence: "Deployed contract address, chain ID, verified source, supply controls, admin model, and emergency procedures",
    status: "needs_evidence",
  },
  {
    id: "security",
    title: "Independent contract security review",
    owner: "External security reviewer",
    evidence: "Named report, scope, commit/bytecode identity, findings, remediations, and verification date",
    status: "needs_evidence",
  },
  {
    id: "identity",
    title: "Identity, sanctions, KYC/AML workflow",
    owner: "Compliance operations",
    evidence: "Provider contract, jurisdiction rules, retention policy, escalation path, and tested failure states",
    status: "blocked",
  },
  {
    id: "payments",
    title: "Payment, custody, refund, and reconciliation controls",
    owner: "Finance + platform operations",
    evidence: "Named providers, settlement path, reconciliation ledger, refund policy, custody boundary, and incident handling",
    status: "blocked",
  },
  {
    id: "tokenomics",
    title: "Approved tokenomics and vesting source",
    owner: "Founder + finance + counsel",
    evidence: "Versioned allocation table, vesting schedules, unlock math, treasury policy, and governance approval record",
    status: "needs_evidence",
  },
  {
    id: "disclosure",
    title: "Investor and purchaser disclosures",
    owner: "Finance + legal",
    evidence: "Risk factors, use-of-proceeds policy, conflicts, dilution/token-supply assumptions, and change-control process",
    status: "blocked",
  },
];

export const investorMetricRequirements: readonly InvestorMetricRequirement[] = [
  {
    id: "active-users",
    metric: "Active beta users",
    source: "Authenticated server-side product telemetry",
    period: "Named daily/weekly/monthly window",
    verification: "Define deduplication, bot filtering, timezone, and last-updated timestamp",
  },
  {
    id: "retention",
    metric: "Retention",
    source: "Cohort event store",
    period: "Named acquisition cohort and Day 1/7/30 windows",
    verification: "Publish numerator, denominator, reactivation rule, and cohort exclusions",
  },
  {
    id: "revenue",
    metric: "Revenue",
    source: "Payment processor + internal ledger reconciliation",
    period: "Named accounting period",
    verification: "Separate gross volume, recognized revenue, refunds, fees, taxes, and test transactions",
  },
  {
    id: "burn-runway",
    metric: "Burn and runway",
    source: "Accounting records + bank/treasury statements",
    period: "Trailing monthly period",
    verification: "State cash definition, liabilities, restricted funds, and calculation date",
  },
  {
    id: "token-supply",
    metric: "Token supply and circulating supply",
    source: "Verified contract + chain indexer",
    period: "Block height and timestamp",
    verification: "Publish contract address, chain ID, mint/burn authority, locked allocations, and circulating methodology",
  },
  {
    id: "treasury",
    metric: "Treasury balance",
    source: "Verified wallets + reconciled off-chain accounts",
    period: "Point-in-time snapshot",
    verification: "Identify controlled addresses/accounts, valuation source, restrictions, and reconciliation timestamp",
  },
];

export const tokenAllocationDraft: readonly TokenAllocationDraft[] = [
  {
    id: "founder",
    label: "Founder / long-term builder allocation",
    percentage: 30,
    note: "Draft planning allocation; vesting and governance controls are not yet approved.",
  },
  {
    id: "ecosystem-investors",
    label: "Ecosystem & strategic investors",
    percentage: 10,
    note: "Draft planning allocation; no sale or investor allocation is currently active.",
  },
  {
    id: "team-advisors",
    label: "Team & advisors",
    percentage: 15,
    note: "Draft planning allocation; requires role-based vesting and conflict disclosures.",
  },
  {
    id: "community",
    label: "Community",
    percentage: 20,
    note: "Draft planning allocation; distribution mechanics are not yet approved.",
  },
  {
    id: "impact",
    label: "SkyHope / impact",
    percentage: 10,
    note: "Draft planning allocation; donation and impact execution remain separate verification boundaries.",
  },
  {
    id: "reserve",
    label: "Reserve",
    percentage: 15,
    note: "Draft planning allocation; treasury policy and authorization controls are not yet approved.",
  },
];

export const investorDataRoomLinks = [
  {
    title: "Token launch readiness",
    description: "Offering gates, security dependencies, compliance boundaries, and launch controls.",
    route: "/i-c-o-launchpad",
  },
  {
    title: "Tokenomics model",
    description: "Scenario-only supply and allocation math with explicit non-offering boundaries.",
    route: "/tokenomics-calculator",
  },
  {
    title: "Investor metrics methodology",
    description: "Metric definitions and the evidence required before publishing investor numbers.",
    route: "/investor-metrics",
  },
  {
    title: "Pitch narrative",
    description: "Evidence-first investor story without synthetic market, revenue, valuation, or traction claims.",
    route: "/investor-pitch",
  },
  {
    title: "Token verification",
    description: "Contract, network, supply, and indexer evidence required before token statistics become authoritative.",
    route: "/token-metrics",
  },
  {
    title: "Vesting verification",
    description: "Controls required before account-specific unlock or claim data can be displayed.",
    route: "/vesting-schedule",
  },
] as const;
