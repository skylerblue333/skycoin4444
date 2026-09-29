export type ImpactProgramId =
  | "shelter-support"
  | "learning-access"
  | "community-tech"
  | "disaster-readiness";

export type ImpactProgram = Readonly<{
  id: ImpactProgramId;
  title: string;
  category: string;
  summary: string;
  actions: readonly string[];
  evidenceNeeded: readonly string[];
  learningRoute: string;
  gameRoute: string;
}>;

export type ImpactCommitment = Readonly<{
  programId: ImpactProgramId;
  volunteerHours: number;
  supplyKits: number;
  focus: string;
}>;

export type ImpactPlan = Readonly<{
  contract: "skyhope.impact-plan.v1";
  programId: ImpactProgramId;
  title: string;
  steps: readonly string[];
  evidenceChecklist: readonly string[];
  limitations: readonly string[];
}>;

export const SKYHOPE_COMMITMENT_STORAGE_KEY =
  "skycoin4444.skyhope.commitment.v1";

export const impactPrograms: readonly ImpactProgram[] = Object.freeze([
  {
    id: "shelter-support",
    title: "Shelter support",
    category: "Community care",
    summary:
      "Plan volunteer time, supply sorting, meal support, or skills-based help for a local shelter or outreach organization.",
    actions: [
      "Contact a real local organization and ask what help is currently useful.",
      "Choose one bounded volunteer task before collecting supplies or money.",
      "Record only hours or items you personally completed or verified.",
    ],
    evidenceNeeded: [
      "organization name and public contact",
      "date and type of activity",
      "receipt or confirmation only when one actually exists",
    ],
    learningRoute: "/sky-school",
    gameRoute: "/gaming-for-charity",
  },
  {
    id: "learning-access",
    title: "Learning access",
    category: "Education",
    summary:
      "Build a tutoring, device-help, book-drive, or skills-sharing plan without inventing student counts, scholarships, or funding.",
    actions: [
      "Pick one learner group and one skill or resource you can realistically support.",
      "Create a short lesson, tutoring block, or resource checklist.",
      "Ask the recipient organization what evidence or privacy rules apply.",
    ],
    evidenceNeeded: [
      "authored lesson or resource",
      "volunteer session record when permitted",
      "no student identity or outcome claim without permission",
    ],
    learningRoute: "/sky-school",
    gameRoute: "/game-crypto-quiz",
  },
  {
    id: "community-tech",
    title: "Community technology",
    category: "Digital access",
    summary:
      "Plan device setup, basic cybersecurity, software help, or digital-literacy support for a community organization.",
    actions: [
      "Identify one concrete technology problem instead of promising a broad transformation.",
      "Prepare a reversible checklist and backup path before changing a device or account.",
      "Document what was actually fixed, what remains, and who owns follow-up.",
    ],
    evidenceNeeded: [
      "before/after task checklist",
      "owner confirmation for account or device changes",
      "no credential collection in SKYCOIN4444",
    ],
    learningRoute: "/sky-school",
    gameRoute: "/arcade#crypto",
  },
  {
    id: "disaster-readiness",
    title: "Disaster readiness",
    category: "Preparedness",
    summary:
      "Create a non-financial preparedness checklist for supplies, contacts, charging, documents, transport, and accessibility needs.",
    actions: [
      "Use official local emergency guidance as the source of truth.",
      "Separate household preparation from claims about emergency response capacity.",
      "Review the plan periodically and remove stale contact or location details.",
    ],
    evidenceNeeded: [
      "dated preparedness checklist",
      "source links from the responsible public agency",
      "no claim that SKYCOIN4444 dispatches emergency services",
    ],
    learningRoute: "/sky-school",
    gameRoute: "/gaming",
  },
]);

function boundedInteger(
  value: unknown,
  minimum: number,
  maximum: number,
): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(parsed)) return minimum;
  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

export function getImpactProgram(id: unknown): ImpactProgram {
  const program = impactPrograms.find(item => item.id === id);
  return program ?? impactPrograms[0];
}

export function normalizeImpactCommitment(
  value: unknown,
): ImpactCommitment {
  const record =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const program = getImpactProgram(record.programId);
  const focus =
    typeof record.focus === "string"
      ? record.focus.trim().slice(0, 240)
      : "";

  return Object.freeze({
    programId: program.id,
    volunteerHours: boundedInteger(record.volunteerHours, 0, 40),
    supplyKits: boundedInteger(record.supplyKits, 0, 100),
    focus,
  });
}

export function buildImpactPlan(
  input: ImpactCommitment,
): ImpactPlan {
  const commitment = normalizeImpactCommitment(input);
  const program = getImpactProgram(commitment.programId);
  const steps = [
    `Start with: ${program.actions[0]}`,
    commitment.volunteerHours > 0
      ? `Reserve up to ${commitment.volunteerHours} volunteer hour${commitment.volunteerHours === 1 ? "" : "s"}; record actual time afterward instead of pre-counting it as impact.`
      : "Choose a realistic volunteer-time limit before starting.",
    commitment.supplyKits > 0
      ? `Prepare up to ${commitment.supplyKits} supply kit${commitment.supplyKits === 1 ? "" : "s"} only after the recipient confirms the contents are useful.`
      : "Do not buy or collect supplies until a recipient confirms what is useful.",
    commitment.focus
      ? `Personal focus: ${commitment.focus}`
      : "Write one sentence describing the person or community need you are trying to support.",
    "Finish by recording what actually happened, what did not happen, and the next follow-up.",
  ];

  return Object.freeze({
    contract: "skyhope.impact-plan.v1" as const,
    programId: program.id,
    title: program.title,
    steps: Object.freeze(steps),
    evidenceChecklist: Object.freeze([...program.evidenceNeeded]),
    limitations: Object.freeze([
      "This is a planning aid, not proof that an organization, donation, beneficiary, or outcome has been verified.",
      "No payment, token transfer, custody, blockchain write, tax receipt, or charity disbursement is executed by this plan.",
      "External organizations and emergency guidance must be verified independently before action.",
    ]),
  });
}

export function impactPlanToText(plan: ImpactPlan): string {
  return [
    `SkyHope Impact Plan — ${plan.title}`,
    "",
    ...plan.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "Evidence to keep:",
    ...plan.evidenceChecklist.map(item => `- ${item}`),
    "",
    "Boundaries:",
    ...plan.limitations.map(item => `- ${item}`),
  ].join("\n");
}
