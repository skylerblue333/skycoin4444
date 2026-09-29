export const SKYHOPE_IMPACT_CONTRACT = "skyhope.impact-plan.v1" as const;

export const SKYHOPE_THEME_OPTIONS = [
  "education",
  "food-security",
  "housing",
  "health",
  "environment",
  "emergency-relief",
  "community",
] as const;

export type SkyHopeTheme = (typeof SKYHOPE_THEME_OPTIONS)[number];

export type SkyHopeImpactPlanInput = {
  title: string;
  theme: SkyHopeTheme;
  beneficiaryGoal: number;
  objective: string;
  evidenceMetric: string;
};

export type SkyHopeMilestone = {
  percent: 25 | 50 | 75 | 100;
  beneficiaryTarget: number;
  checkpoint: string;
};

export type SkyHopeImpactPlan = {
  contract: typeof SKYHOPE_IMPACT_CONTRACT;
  id: string;
  title: string;
  theme: SkyHopeTheme;
  beneficiaryGoal: number;
  objective: string;
  evidenceMetric: string;
  milestones: readonly SkyHopeMilestone[];
  hopeAiBrief: string;
  boundary: typeof SKYHOPE_IMPACT_BOUNDARY;
};

export const SKYHOPE_IMPACT_BOUNDARY = {
  mode: "engineering-beta-planning",
  executesPayments: false,
  acceptsCustody: false,
  verifiesBeneficiaries: false,
  verifiesExternalPartners: false,
  writesBlockchainTransactions: false,
  durableServerCampaignStore: false,
  draftPersistence: "device-local",
} as const;

function requiredText(value: string, field: string, max: number): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) throw new TypeError(`${field} is required`);
  if (normalized.length > max) {
    throw new RangeError(`${field} must be at most ${max} characters`);
  }
  return normalized;
}

function normalizeBeneficiaryGoal(value: number): number {
  if (!Number.isSafeInteger(value) || value < 1 || value > 1_000_000) {
    throw new RangeError(
      "beneficiaryGoal must be a whole number between 1 and 1,000,000",
    );
  }
  return value;
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "impact-plan";
}

function checksum(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function milestoneCheckpoint(percent: 25 | 50 | 75 | 100): string {
  if (percent === 25) return "Validate need, consent, eligibility, and baseline evidence.";
  if (percent === 50) return "Review delivery evidence and correct weak assumptions.";
  if (percent === 75) return "Audit remaining risks, accessibility, and completion blockers.";
  return "Publish outcome evidence, limitations, and a follow-up learning plan.";
}

export function buildHopeAiImpactBrief(
  plan: Pick<
    SkyHopeImpactPlan,
    "title" | "theme" | "beneficiaryGoal" | "objective" | "evidenceMetric"
  >,
): string {
  return [
    "Act as a careful impact-planning coach for a SKYCOIN4444 engineering beta.",
    `Campaign draft: ${plan.title}`,
    `Theme: ${plan.theme}`,
    `Beneficiary goal: ${plan.beneficiaryGoal}`,
    `Objective: ${plan.objective}`,
    `Evidence metric: ${plan.evidenceMetric}`,
    "Help me improve the needs statement, evidence plan, delivery risks, consent/accessibility checks, and a launch checklist.",
    "Do not claim a charity is verified, money moved, a partner exists, or blockchain proof exists unless I provide evidence.",
  ].join("\n");
}

export function buildSkyHopeImpactPlan(
  input: SkyHopeImpactPlanInput,
): SkyHopeImpactPlan {
  const title = requiredText(input.title, "title", 120);
  const objective = requiredText(input.objective, "objective", 500);
  const evidenceMetric = requiredText(input.evidenceMetric, "evidenceMetric", 240);
  const beneficiaryGoal = normalizeBeneficiaryGoal(input.beneficiaryGoal);

  if (!SKYHOPE_THEME_OPTIONS.includes(input.theme)) {
    throw new TypeError("theme is not supported");
  }

  const idSeed = [
    title,
    input.theme,
    String(beneficiaryGoal),
    objective,
    evidenceMetric,
  ].join("|");

  const milestones = ([25, 50, 75, 100] as const).map(percent => ({
    percent,
    beneficiaryTarget: Math.max(
      1,
      Math.ceil((beneficiaryGoal * percent) / 100),
    ),
    checkpoint: milestoneCheckpoint(percent),
  }));

  const planBase = {
    title,
    theme: input.theme,
    beneficiaryGoal,
    objective,
    evidenceMetric,
  };

  return {
    contract: SKYHOPE_IMPACT_CONTRACT,
    id: `skyhope-${slugify(title)}-${checksum(idSeed)}`,
    ...planBase,
    milestones,
    hopeAiBrief: buildHopeAiImpactBrief(planBase),
    boundary: SKYHOPE_IMPACT_BOUNDARY,
  };
}
