export const SKYHOPE_DRAFT_KEY = "sky4444.skyhope.campaign-draft.v1";

export type SkyHopeCampaignDraft = Readonly<{
  title: string;
  mission: string;
  beneficiaryScope: string;
  targetOutcome: string;
  targetCount: number;
  durationDays: number;
}>;

export type SkyHopeMilestone = Readonly<{
  id: string;
  label: string;
  targetDay: number;
  evidencePrompt: string;
}>;

export type SkyHopeCampaignPlan = SkyHopeCampaignDraft &
  Readonly<{
    milestones: readonly SkyHopeMilestone[];
    provenance: "deterministic-local-plan";
  }>;

export type ImpactEvidenceState = Readonly<{
  needDefined: boolean;
  baselineCaptured: boolean;
  consentPlanned: boolean;
  metricDefined: boolean;
  updateCadenceDefined: boolean;
  privacyReviewed: boolean;
}>;

export type ImpactReadiness = Readonly<{
  score: number;
  readyCount: number;
  totalCount: number;
  missing: readonly string[];
}>;

export type VolunteerCapacityInput = Readonly<{
  volunteerCount: number;
  hoursPerVolunteerPerWeek: number;
  weeks: number;
}>;

export type VolunteerCapacityPlan = VolunteerCapacityInput &
  Readonly<{
    totalCapacityHours: number;
    provenance: "deterministic-local-plan";
  }>;

export const SKYHOPE_CAUSE_TRACKS = Object.freeze([
  {
    id: "education",
    label: "Education & opportunity",
    description:
      "Plan tutoring, school-support, digital-skills, scholarship, or learning-access work with measurable outcomes.",
    nextHref: "/sky-school",
    nextLabel: "Open SkySchool",
  },
  {
    id: "community",
    label: "Community support",
    description:
      "Organize volunteer work, local mutual-aid planning, resource navigation, and community updates.",
    nextHref: "/activity-feed",
    nextLabel: "Open Community",
  },
  {
    id: "wellbeing",
    label: "Wellbeing & basic needs",
    description:
      "Structure non-clinical support projects around food, shelter, transport, supplies, and referral coordination.",
    nextHref: "/hope-a-i",
    nextLabel: "Plan with HopeAI",
  },
  {
    id: "impact-play",
    label: "Impact play & learning",
    description:
      "Use game-only activities and educational challenges to build awareness without real-money wagering or token payouts.",
    nextHref: "/gaming",
    nextLabel: "Open Gaming",
  },
] as const);

const evidenceLabels: ReadonlyArray<readonly [keyof ImpactEvidenceState, string]> = [
  ["needDefined", "Problem/need is clearly defined"],
  ["baselineCaptured", "Baseline evidence is captured"],
  ["consentPlanned", "Consent for sensitive stories/data is planned"],
  ["metricDefined", "Outcome metric and counting method are defined"],
  ["updateCadenceDefined", "Update/reporting cadence is defined"],
  ["privacyReviewed", "Privacy and beneficiary-safety risks are reviewed"],
] as const;

function normalizeText(value: string, field: string, max: number, min = 3) {
  if (typeof value !== "string") throw new TypeError(field + " must be text");
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length < min || normalized.length > max) {
    throw new RangeError(field + " must be between " + min + " and " + max + " characters");
  }
  return normalized;
}

function positiveInteger(value: number, field: string, max: number) {
  if (!Number.isSafeInteger(value) || value <= 0 || value > max) {
    throw new RangeError(field + " must be a positive integer up to " + max);
  }
  return value;
}

export function createSkyHopeCampaignPlan(
  input: SkyHopeCampaignDraft
): SkyHopeCampaignPlan {
  const durationDays = positiveInteger(input.durationDays, "durationDays", 365);
  const targetCount = positiveInteger(input.targetCount, "targetCount", 1_000_000);
  const draft: SkyHopeCampaignDraft = {
    title: normalizeText(input.title, "title", 120),
    mission: normalizeText(input.mission, "mission", 600, 10),
    beneficiaryScope: normalizeText(
      input.beneficiaryScope,
      "beneficiaryScope",
      240,
      5
    ),
    targetOutcome: normalizeText(input.targetOutcome, "targetOutcome", 240, 5),
    targetCount,
    durationDays,
  };

  const milestone = (
    id: string,
    label: string,
    fraction: number,
    evidencePrompt: string
  ): SkyHopeMilestone => ({
    id,
    label,
    targetDay: Math.max(1, Math.round(durationDays * fraction)),
    evidencePrompt,
  });

  return Object.freeze({
    ...draft,
    milestones: Object.freeze([
      milestone(
        "baseline",
        "Baseline + safety review",
        0.1,
        "Record the starting condition, consent plan, risks, and measurement method."
      ),
      milestone(
        "first-delivery",
        "First delivery checkpoint",
        0.25,
        "Record what was delivered, to whom, and the evidence source without exposing sensitive beneficiary data."
      ),
      milestone(
        "midpoint",
        "Midpoint outcome check",
        0.5,
        "Compare measured progress with the baseline and document changes to the plan."
      ),
      milestone(
        "closeout",
        "Closeout + transparent report",
        1,
        "Record final measured outcomes, limitations, unresolved needs, and the evidence used."
      ),
    ]),
    provenance: "deterministic-local-plan",
  });
}

export function normalizeSkyHopeCampaignDraft(
  value: unknown
): SkyHopeCampaignDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  try {
    const plan = createSkyHopeCampaignPlan({
      title: String(candidate.title ?? ""),
      mission: String(candidate.mission ?? ""),
      beneficiaryScope: String(candidate.beneficiaryScope ?? ""),
      targetOutcome: String(candidate.targetOutcome ?? ""),
      targetCount: Number(candidate.targetCount),
      durationDays: Number(candidate.durationDays),
    });
    const { milestones: _milestones, provenance: _provenance, ...draft } = plan;
    return draft;
  } catch {
    return null;
  }
}

export function scoreImpactReadiness(
  state: ImpactEvidenceState
): ImpactReadiness {
  const ready = evidenceLabels.filter(([key]) => state[key]);
  const missing = evidenceLabels
    .filter(([key]) => !state[key])
    .map(([, label]) => label);
  return Object.freeze({
    score: Math.round((ready.length / evidenceLabels.length) * 100),
    readyCount: ready.length,
    totalCount: evidenceLabels.length,
    missing: Object.freeze(missing),
  });
}

export function createVolunteerCapacityPlan(
  input: VolunteerCapacityInput
): VolunteerCapacityPlan {
  const volunteerCount = positiveInteger(
    input.volunteerCount,
    "volunteerCount",
    100_000
  );
  const weeks = positiveInteger(input.weeks, "weeks", 104);
  if (
    !Number.isFinite(input.hoursPerVolunteerPerWeek) ||
    input.hoursPerVolunteerPerWeek <= 0 ||
    input.hoursPerVolunteerPerWeek > 80
  ) {
    throw new RangeError("hoursPerVolunteerPerWeek must be greater than 0 and at most 80");
  }
  const hoursPerVolunteerPerWeek =
    Math.round(input.hoursPerVolunteerPerWeek * 100) / 100;
  const totalCapacityHours =
    Math.round(volunteerCount * hoursPerVolunteerPerWeek * weeks * 100) / 100;
  if (!Number.isSafeInteger(Math.round(totalCapacityHours * 100))) {
    throw new RangeError("volunteer capacity is too large");
  }
  return Object.freeze({
    volunteerCount,
    hoursPerVolunteerPerWeek,
    weeks,
    totalCapacityHours,
    provenance: "deterministic-local-plan",
  });
}

export const impactEvidenceLabels = Object.freeze(
  evidenceLabels.map(([key, label]) => ({ key, label }))
);
