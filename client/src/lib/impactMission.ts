export const IMPACT_MISSION_STORAGE_KEY = "sky4444.impact.mission";

export type ImpactCause =
  | "education"
  | "community"
  | "relief"
  | "environment";

export type ImpactMissionStepKind =
  | "learn"
  | "plan"
  | "play"
  | "share";

export type ImpactMissionStep = Readonly<{
  id: string;
  kind: ImpactMissionStepKind;
  title: string;
  detail: string;
  href: string;
  minutes: number;
  evidence: string;
}>;

export type ImpactMission = Readonly<{
  contract: "skyhope.impact-mission.v1";
  id: string;
  title: string;
  goal: string;
  cause: ImpactCause;
  totalMinutes: number;
  steps: readonly ImpactMissionStep[];
  shareText: string;
  boundary: Readonly<{
    mode: "planning-and-evidence";
    financialExecution: false;
    donationSettlement: false;
    custody: false;
    blockchainBroadcast: false;
    beneficiaryVerification: false;
  }>;
}>;

const DEFAULT_GOAL =
  "Help one person or community through a small action that can be checked honestly.";

const CAUSE_LABELS: Record<ImpactCause, string> = {
  education: "Education",
  community: "Community",
  relief: "Relief",
  environment: "Environment",
};

function normalizeGoal(value: string): string {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 360);
  return normalized || DEFAULT_GOAL;
}

function stableId(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return "impact:" + (hash >>> 0).toString(16).padStart(8, "0");
}

export function inferImpactCause(goal: string): ImpactCause {
  const normalized = normalizeGoal(goal).toLowerCase();

  if (
    /school|student|learn|lesson|course|teach|scholar|literacy|stem/.test(
      normalized
    )
  ) {
    return "education";
  }

  if (
    /disaster|emergency|shelter|food|hunger|housing|relief|recovery/.test(
      normalized
    )
  ) {
    return "relief";
  }

  if (
    /water|climate|tree|environment|clean|recycle|park|nature/.test(
      normalized
    )
  ) {
    return "environment";
  }

  return "community";
}

function stepsFor(cause: ImpactCause): readonly ImpactMissionStep[] {
  const causeLabel = CAUSE_LABELS[cause].toLowerCase();

  return Object.freeze([
    Object.freeze({
      id: "impact-learn",
      kind: "learn" as const,
      title: "Learn the problem before claiming a solution",
      detail:
        "Use SkySchool to complete one relevant lesson or research checkpoint connected to " +
        causeLabel +
        ". Record what changed in your understanding.",
      href: "/sky-school",
      minutes: 15,
      evidence: "Lesson completion or written learning note",
    }),
    Object.freeze({
      id: "impact-plan",
      kind: "plan" as const,
      title: "Define one verifiable action",
      detail:
        "Write one bounded action, who it is intended to help, and what evidence would count. Do not claim a beneficiary is verified unless an external process actually verified it.",
      href: "/charity",
      minutes: 10,
      evidence: "Mission goal + beneficiary criteria + completion evidence",
    }),
    Object.freeze({
      id: "impact-play",
      kind: "play" as const,
      title: "Use the Impact Play Lab as a practice loop",
      detail:
        "Run a no-value game or learning challenge tied to the mission. Game scores remain practice signals; they do not create donations, payouts, or token value.",
      href: "/gaming-for-charity",
      minutes: 10,
      evidence: "Practice result or reflection",
    }),
    Object.freeze({
      id: "impact-share",
      kind: "share" as const,
      title: "Share progress without fake impact metrics",
      detail:
        "Post what you actually did, what is still unverified, and the next step. Avoid invented donation totals, beneficiary counts, or on-chain claims.",
      href: "/activity-feed",
      minutes: 8,
      evidence: "A truthful social progress update",
    }),
  ]);
}

export function createImpactMission(input: {
  goal: string;
  cause?: ImpactCause;
}): ImpactMission {
  const goal = normalizeGoal(input.goal);
  const cause = input.cause ?? inferImpactCause(goal);
  const steps = stepsFor(cause);
  const totalMinutes = steps.reduce((total, step) => total + step.minutes, 0);
  const title = CAUSE_LABELS[cause] + " impact mission";

  return Object.freeze({
    contract: "skyhope.impact-mission.v1",
    id: stableId(cause + ":" + goal.toLowerCase()),
    title,
    goal,
    cause,
    totalMinutes,
    steps,
    shareText:
      "SKYCOIN4444 impact mission — " +
      goal +
      " I am tracking actions and evidence, not claiming a donation, payout, verified beneficiary, or on-chain settlement.",
    boundary: Object.freeze({
      mode: "planning-and-evidence",
      financialExecution: false,
      donationSettlement: false,
      custody: false,
      blockchainBroadcast: false,
      beneficiaryVerification: false,
    }),
  });
}

export function isImpactMission(value: unknown): value is ImpactMission {
  if (!value || typeof value !== "object") return false;
  const mission = value as Partial<ImpactMission>;
  if (
    mission.contract !== "skyhope.impact-mission.v1" ||
    typeof mission.id !== "string" ||
    typeof mission.title !== "string" ||
    typeof mission.goal !== "string" ||
    !["education", "community", "relief", "environment"].includes(
      String(mission.cause)
    ) ||
    !Number.isSafeInteger(mission.totalMinutes) ||
    !Array.isArray(mission.steps) ||
    mission.steps.length !== 4
  ) {
    return false;
  }

  if (
    !mission.boundary ||
    mission.boundary.mode !== "planning-and-evidence" ||
    mission.boundary.financialExecution !== false ||
    mission.boundary.donationSettlement !== false ||
    mission.boundary.custody !== false ||
    mission.boundary.blockchainBroadcast !== false ||
    mission.boundary.beneficiaryVerification !== false
  ) {
    return false;
  }

  return mission.steps.every(step => {
    if (!step || typeof step !== "object") return false;
    const candidate = step as Partial<ImpactMissionStep>;
    return (
      typeof candidate.id === "string" &&
      ["learn", "plan", "play", "share"].includes(String(candidate.kind)) &&
      typeof candidate.title === "string" &&
      typeof candidate.detail === "string" &&
      typeof candidate.href === "string" &&
      candidate.href.startsWith("/") &&
      Number.isSafeInteger(candidate.minutes) &&
      Number(candidate.minutes) > 0 &&
      typeof candidate.evidence === "string"
    );
  });
}
