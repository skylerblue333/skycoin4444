export type ImpactWorkspaceArea =
  | "hopeai"
  | "education"
  | "social"
  | "gaming"
  | "charity";

export type ImpactCause =
  | "education"
  | "community"
  | "food"
  | "housing"
  | "mental-health"
  | "environment"
  | "custom";

export interface ImpactWorkspaceStep {
  area: ImpactWorkspaceArea;
  label: string;
  route: string;
  detail: string;
  proofPrompt: string;
}

const STEPS: Readonly<Record<ImpactWorkspaceArea, ImpactWorkspaceStep>> = {
  hopeai: {
    area: "hopeai",
    label: "Plan with HopeAI",
    route: "/hope-a-i",
    detail:
      "Turn the goal into a practical plan, questions, risks, and next actions.",
    proofPrompt:
      "Keep AI output labeled as advice/planning until a person or external system verifies the result.",
  },
  education: {
    area: "education",
    label: "Learn before acting",
    route: "/sky-school",
    detail:
      "Use lessons and quizzes to build knowledge around the cause before asking others to act.",
    proofPrompt:
      "Record learning completion separately from real-world impact.",
  },
  social: {
    area: "social",
    label: "Invite the community",
    route: "/activity-feed",
    detail:
      "Draft a truthful update, request volunteers, and collect feedback without inventing reach or results.",
    proofPrompt:
      "A drafted or published post is not proof that an external outcome occurred.",
  },
  gaming: {
    area: "gaming",
    label: "Make it engaging",
    route: "/gaming-for-charity",
    detail:
      "Use demo-only games as learning and awareness challenges with no wager or automatic payout.",
    proofPrompt:
      "Game scores prove gameplay only; they do not prove donations or financial settlement.",
  },
  charity: {
    area: "charity",
    label: "Review the impact path",
    route: "/charity",
    detail:
      "Keep beneficiary, evidence, provider, legal, and finance gates visible before external handoff.",
    proofPrompt:
      "Do not claim a verified beneficiary, donation, settlement, or charity outcome without evidence.",
  },
};

const AREA_ORDER: readonly ImpactWorkspaceArea[] = [
  "hopeai",
  "education",
  "social",
  "gaming",
  "charity",
];

export function buildImpactWorkspacePath(
  selected: readonly ImpactWorkspaceArea[],
): readonly ImpactWorkspaceStep[] {
  const unique = new Set(selected);
  return AREA_ORDER.filter(area => unique.has(area)).map(area => STEPS[area]);
}

export function createImpactHopePrompt(input: {
  title: string;
  cause: ImpactCause;
  goal: string;
  selectedAreas: readonly ImpactWorkspaceArea[];
}): string {
  const title = input.title.trim();
  const goal = input.goal.trim();
  if (!title || title.length > 160) throw new Error("mission title is required");
  if (!goal || goal.length > 1_000) throw new Error("mission goal is required");

  const areas = buildImpactWorkspacePath(input.selectedAreas);
  if (areas.length === 0) throw new Error("select at least one mission area");

  return [
    "Help me plan this SKYCOIN4444 impact mission.",
    `Mission: ${title}`,
    `Cause: ${input.cause}`,
    `Goal: ${goal}`,
    `Areas: ${areas.map(item => item.area).join(", ")}`,
    "",
    "Please return:",
    "1. The smallest useful action I can complete now.",
    "2. A learning checklist.",
    "3. A volunteer/community message draft.",
    "4. An evidence checklist that separates observed progress from verified external outcomes.",
    "5. Risks, dependencies, and anything requiring a beneficiary, provider, legal, or safety check.",
    "",
    "Do not claim that a donation, payment, beneficiary verification, social post, game reward, credential, or real-world outcome happened unless evidence is provided.",
  ].join("\n");
}

export function createImpactSocialDraft(input: {
  title: string;
  cause: ImpactCause;
  update: string;
}): string {
  const title = input.title.trim();
  const update = input.update.trim();
  if (!title || title.length > 160) throw new Error("mission title is required");
  if (!update || update.length > 800) throw new Error("mission update is required");

  return [
    `${title} · ${input.cause}`,
    "",
    update,
    "",
    "We’re tracking progress with evidence and will distinguish planned actions from completed external outcomes.",
  ].join("\n");
}
