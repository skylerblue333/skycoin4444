export type ImpactMissionArea =
  | "hopeai"
  | "charity"
  | "education"
  | "social"
  | "gaming";

export type MissionEvidenceKind =
  | "learning-completion"
  | "volunteer-confirmation"
  | "community-response"
  | "game-score"
  | "donation-record"
  | "external-reference";

export type MissionEvidenceTrust =
  | "self-reported"
  | "system-observed"
  | "external-reference";

export interface ImpactMissionInput {
  id: string;
  title: string;
  cause: string;
  objective: string;
  beneficiaryId?: string | null;
  areas: readonly ImpactMissionArea[];
}

export interface ImpactMission {
  contract: "sky.impact.mission.v1";
  id: string;
  title: string;
  cause: string;
  objective: string;
  beneficiaryId: string | null;
  areas: readonly ImpactMissionArea[];
  financialExecutionBySkycoin4444: false;
  externalActionPerformed: false;
}

export interface MissionRouteStep {
  area: ImpactMissionArea;
  route: string;
  label: string;
  purpose: string;
  externalSideEffect: false;
}

export interface HopeAICoachBrief {
  contract: "sky.hopeai.impact-coach-brief.v1";
  missionId: string;
  specialistRoles: readonly [
    "mission-planner",
    "teacher",
    "community-coordinator",
    "impact-analyst",
    "safety-reviewer",
  ];
  context: string;
  questions: readonly string[];
  requestedOutputs: readonly string[];
  providerExecutionRequired: true;
  aiCallPerformed: false;
}

export interface CharityMissionReadinessInput {
  beneficiaryVerified: boolean;
  evidencePlanDefined: boolean;
  financialActionRequested: boolean;
  financePolicyApproved: boolean;
  externalProviderApproved: boolean;
}

export interface CharityMissionReadiness {
  ready: boolean;
  reasons: readonly string[];
  financialExecutionAllowedByThisModule: false;
  providerHandoffRequired: boolean;
}

export interface SocialImpactShareDraft {
  contract: "sky.impact.social-share-draft.v1";
  missionId: string;
  headline: string;
  body: string;
  suggestedRoute: "/activity-feed";
  posted: false;
  donationClaimMade: false;
}

export interface ImpactGameChallenge {
  contract: "sky.impact.game-challenge.v1";
  missionId: string;
  gameRoute: string;
  targetScore: number;
  educationalPrompt: string;
  financialReward: false;
  wagerCreated: false;
  donationTriggered: false;
}

export interface ImpactLearningPlan {
  contract: "sky.impact.learning-plan.v1";
  missionId: string;
  lessonRoute: string;
  quizTag: string;
  reflectionPrompt: string;
  credentialIssued: false;
  completionVerifiedExternally: false;
}

export interface MissionEvidenceInput {
  id: string;
  kind: MissionEvidenceKind;
  trust: MissionEvidenceTrust;
  summary: string;
  reference?: string;
  occurredAt: string;
}

export interface MissionEvidenceRecord extends MissionEvidenceInput {
  missionId: string;
  externallyVerified: false;
  financialSettlementProven: false;
}

export interface MissionDashboard {
  missionId: string;
  totalEvidence: number;
  learningSignals: number;
  communitySignals: number;
  gamingSignals: number;
  donationRecords: number;
  externallyVerifiedEvidence: 0;
  financialSettlementProven: false;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const TAG = /^[a-z0-9][a-z0-9-]{0,31}$/;
const ROUTE = /^\/[a-z0-9][a-z0-9-/]{0,159}$/;
const MAX_TEXT = 2_000;

const AREA_ORDER: readonly ImpactMissionArea[] = [
  "hopeai",
  "education",
  "social",
  "gaming",
  "charity",
];

const ROUTE_STEPS: Readonly<Record<ImpactMissionArea, Omit<MissionRouteStep, "area">>> = {
  hopeai: {
    route: "/hope-a-i",
    label: "Plan with HopeAI",
    purpose:
      "Turn the mission into questions, tasks, safeguards, and measurable next actions.",
    externalSideEffect: false,
  },
  education: {
    route: "/sky-school",
    label: "Learn the cause",
    purpose:
      "Build knowledge before asking people to act, give, volunteer, or share.",
    externalSideEffect: false,
  },
  social: {
    route: "/activity-feed",
    label: "Build community",
    purpose:
      "Prepare a truthful community update and invite discussion without fabricating reach or outcomes.",
    externalSideEffect: false,
  },
  gaming: {
    route: "/gaming-for-charity",
    label: "Create an impact challenge",
    purpose:
      "Use demo-only games as awareness or learning challenges without wagers or automatic financial rewards.",
    externalSideEffect: false,
  },
  charity: {
    route: "/charity",
    label: "Review the impact path",
    purpose:
      "Keep beneficiary, evidence, provider, and finance gates explicit before any external donation handoff.",
    externalSideEffect: false,
  },
};

const ALLOWED_GAME_ROUTES = new Set([
  "/game-blackjack",
  "/game-crash",
  "/game-crypto-quiz",
  "/game-high-low",
  "/game-plinko",
  "/game-roulette",
  "/game-token-tap",
  "/game-block-builder",
]);

function boundedText(value: unknown, field: string, max = MAX_TEXT): string {
  if (typeof value !== "string") throw new TypeError(`${field} must be a string`);
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > max) {
    throw new TypeError(`${field} must contain 1-${max} characters`);
  }
  return normalized;
}

function optionalId(value: string | null | undefined, field: string): string | null {
  if (value === undefined || value === null || value.trim() === "") return null;
  const normalized = value.trim();
  if (!ID.test(normalized)) throw new TypeError(`${field} is invalid`);
  return normalized;
}

function strictId(value: unknown, field: string): string {
  if (typeof value !== "string" || !ID.test(value.trim())) {
    throw new TypeError(`${field} is invalid`);
  }
  return value.trim();
}

function strictIsoUtc(value: string): string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new TypeError("occurredAt must be a valid ISO-8601 UTC timestamp");
  }
  return value;
}

function normalizeAreas(areas: readonly ImpactMissionArea[]): readonly ImpactMissionArea[] {
  if (!Array.isArray(areas) || areas.length === 0 || areas.length > AREA_ORDER.length) {
    throw new TypeError("areas must contain 1-5 impact areas");
  }
  const unique = new Set<ImpactMissionArea>();
  for (const area of areas) {
    if (!AREA_ORDER.includes(area)) throw new TypeError("unsupported impact area");
    unique.add(area);
  }
  return Object.freeze(AREA_ORDER.filter(area => unique.has(area)));
}

export function createImpactMission(input: ImpactMissionInput): ImpactMission {
  if (!input || typeof input !== "object") throw new TypeError("mission input is required");
  return Object.freeze({
    contract: "sky.impact.mission.v1" as const,
    id: strictId(input.id, "mission.id"),
    title: boundedText(input.title, "mission.title", 160),
    cause: boundedText(input.cause, "mission.cause", 120),
    objective: boundedText(input.objective, "mission.objective", 1_000),
    beneficiaryId: optionalId(input.beneficiaryId, "mission.beneficiaryId"),
    areas: normalizeAreas(input.areas),
    financialExecutionBySkycoin4444: false as const,
    externalActionPerformed: false as const,
  });
}

export function planImpactMissionRoutes(
  mission: ImpactMission,
): readonly MissionRouteStep[] {
  const normalized = createImpactMission(mission);
  return Object.freeze(
    normalized.areas.map(area =>
      Object.freeze({
        area,
        ...ROUTE_STEPS[area],
      }),
    ),
  );
}

export function buildHopeAICoachBrief(
  mission: ImpactMission,
  request: string,
): HopeAICoachBrief {
  const normalized = createImpactMission(mission);
  const requestedGoal = boundedText(request, "request", 1_200);
  return Object.freeze({
    contract: "sky.hopeai.impact-coach-brief.v1" as const,
    missionId: normalized.id,
    specialistRoles: Object.freeze([
      "mission-planner",
      "teacher",
      "community-coordinator",
      "impact-analyst",
      "safety-reviewer",
    ] as const),
    context: [
      `Mission: ${normalized.title}`,
      `Cause: ${normalized.cause}`,
      `Objective: ${normalized.objective}`,
      normalized.beneficiaryId
        ? `Beneficiary reference: ${normalized.beneficiaryId}`
        : "Beneficiary reference: not yet defined",
      `Requested help: ${requestedGoal}`,
    ].join("\n"),
    questions: Object.freeze([
      "What is the smallest useful action that can be completed now?",
      "What evidence would show progress without overstating impact?",
      "Which step needs a human, provider, legal, safety, or beneficiary check?",
      "What should be learned before asking the community to act?",
      "How can the mission remain useful if no money changes hands?",
    ]),
    requestedOutputs: Object.freeze([
      "ordered action plan",
      "learning checklist",
      "community message draft",
      "impact evidence checklist",
      "risk and dependency list",
    ]),
    providerExecutionRequired: true as const,
    aiCallPerformed: false as const,
  });
}

export function evaluateCharityMissionReadiness(
  input: CharityMissionReadinessInput,
): CharityMissionReadiness {
  if (!input || typeof input !== "object") {
    throw new TypeError("charity readiness input is required");
  }
  const reasons: string[] = [];
  if (!input.beneficiaryVerified) reasons.push("beneficiary-not-verified");
  if (!input.evidencePlanDefined) reasons.push("evidence-plan-required");

  if (input.financialActionRequested) {
    if (!input.financePolicyApproved) reasons.push("finance-policy-not-approved");
    if (!input.externalProviderApproved) reasons.push("external-provider-not-approved");
  }

  return Object.freeze({
    ready: reasons.length === 0,
    reasons: Object.freeze(reasons),
    financialExecutionAllowedByThisModule: false as const,
    providerHandoffRequired: input.financialActionRequested,
  });
}

export function createSocialImpactShareDraft(
  mission: ImpactMission,
  update: string,
): SocialImpactShareDraft {
  const normalized = createImpactMission(mission);
  const body = boundedText(update, "update", 800);
  return Object.freeze({
    contract: "sky.impact.social-share-draft.v1" as const,
    missionId: normalized.id,
    headline: `${normalized.title} · ${normalized.cause}`,
    body: `${body}\n\nProgress should be backed by evidence. This draft does not claim a donation, beneficiary verification, or completed external action.`,
    suggestedRoute: "/activity-feed" as const,
    posted: false as const,
    donationClaimMade: false as const,
  });
}

export function createImpactGameChallenge(
  mission: ImpactMission,
  input: {
    gameRoute: string;
    targetScore: number;
    educationalPrompt: string;
  },
): ImpactGameChallenge {
  const normalized = createImpactMission(mission);
  if (!ALLOWED_GAME_ROUTES.has(input.gameRoute)) {
    throw new TypeError("unsupported impact game route");
  }
  if (
    !Number.isSafeInteger(input.targetScore) ||
    input.targetScore < 1 ||
    input.targetScore > 1_000_000
  ) {
    throw new RangeError("targetScore must be an integer from 1 to 1000000");
  }
  return Object.freeze({
    contract: "sky.impact.game-challenge.v1" as const,
    missionId: normalized.id,
    gameRoute: input.gameRoute,
    targetScore: input.targetScore,
    educationalPrompt: boundedText(
      input.educationalPrompt,
      "educationalPrompt",
      500,
    ),
    financialReward: false as const,
    wagerCreated: false as const,
    donationTriggered: false as const,
  });
}

export function createImpactLearningPlan(
  mission: ImpactMission,
  input: {
    lessonRoute: string;
    quizTag: string;
    reflectionPrompt: string;
  },
): ImpactLearningPlan {
  const normalized = createImpactMission(mission);
  if (!ROUTE.test(input.lessonRoute)) throw new TypeError("lessonRoute is invalid");
  if (!TAG.test(input.quizTag)) throw new TypeError("quizTag is invalid");
  return Object.freeze({
    contract: "sky.impact.learning-plan.v1" as const,
    missionId: normalized.id,
    lessonRoute: input.lessonRoute,
    quizTag: input.quizTag,
    reflectionPrompt: boundedText(input.reflectionPrompt, "reflectionPrompt", 500),
    credentialIssued: false as const,
    completionVerifiedExternally: false as const,
  });
}

export function recordMissionEvidence(
  mission: ImpactMission,
  input: MissionEvidenceInput,
): MissionEvidenceRecord {
  const normalized = createImpactMission(mission);
  const id = strictId(input.id, "evidence.id");
  const summary = boundedText(input.summary, "evidence.summary", 1_000);
  const occurredAt = strictIsoUtc(input.occurredAt);

  const kinds: readonly MissionEvidenceKind[] = [
    "learning-completion",
    "volunteer-confirmation",
    "community-response",
    "game-score",
    "donation-record",
    "external-reference",
  ];
  const trusts: readonly MissionEvidenceTrust[] = [
    "self-reported",
    "system-observed",
    "external-reference",
  ];
  if (!kinds.includes(input.kind)) throw new TypeError("unsupported evidence kind");
  if (!trusts.includes(input.trust)) throw new TypeError("unsupported evidence trust");
  if (input.trust === "external-reference" && !input.reference) {
    throw new TypeError("external-reference evidence requires a reference");
  }

  const reference =
    input.reference === undefined
      ? undefined
      : boundedText(input.reference, "evidence.reference", 1_000);

  return Object.freeze({
    id,
    kind: input.kind,
    trust: input.trust,
    summary,
    ...(reference ? { reference } : {}),
    occurredAt,
    missionId: normalized.id,
    externallyVerified: false as const,
    financialSettlementProven: false as const,
  });
}

export function buildMissionDashboard(
  mission: ImpactMission,
  evidence: readonly MissionEvidenceRecord[],
): MissionDashboard {
  const normalized = createImpactMission(mission);
  if (!Array.isArray(evidence) || evidence.length > 10_000) {
    throw new TypeError("evidence must contain at most 10000 records");
  }
  for (const record of evidence) {
    if (record.missionId !== normalized.id) {
      throw new Error("evidence belongs to a different mission");
    }
    if (record.externallyVerified !== false || record.financialSettlementProven !== false) {
      throw new Error("unsupported verified evidence claim");
    }
  }

  return Object.freeze({
    missionId: normalized.id,
    totalEvidence: evidence.length,
    learningSignals: evidence.filter(item => item.kind === "learning-completion").length,
    communitySignals: evidence.filter(
      item =>
        item.kind === "volunteer-confirmation" ||
        item.kind === "community-response",
    ).length,
    gamingSignals: evidence.filter(item => item.kind === "game-score").length,
    donationRecords: evidence.filter(item => item.kind === "donation-record").length,
    externallyVerifiedEvidence: 0 as const,
    financialSettlementProven: false as const,
  });
}

export const IMPACT_MISSION_BOUNDARY = Object.freeze({
  areas: AREA_ORDER,
  routeSteps: ROUTE_STEPS,
  executesAIProviderCalls: false,
  postsToSocialNetworks: false,
  executesDonations: false,
  executesPayments: false,
  createsWagers: false,
  issuesCredentials: false,
  verifiesBeneficiaries: false,
  verifiesExternalEvidence: false,
});
