import type {
  HopeActivitySummary,
  HopeFocus,
  HopePlan,
  HopePlanStep,
} from "./hopeCoach";

export const HOPE_SPRINT_HISTORY_KEY = "sky4444.hopeai.sprint-history.v1";
export const HOPE_SPRINT_HISTORY_LIMIT = 10;

export type HopeSprintNextAction = Readonly<{
  focus: HopeFocus;
  title: string;
  href: string;
  reason: string;
}>;

export type HopeSprintReceipt = Readonly<{
  id: string;
  planTitle: string;
  focus: HopeFocus;
  completedStepIds: readonly string[];
  stepCount: number;
  reflection: string;
  completedAt: string;
  nextAction: HopeSprintNextAction;
  provenance: "tester-confirmed-local-receipt";
}>;

const FOCUS_VALUES = new Set<HopeFocus>(["build", "learn", "play", "ship"]);

function normalizeText(value: string, maxLength: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function isSafeRoute(value: unknown): value is string {
  return typeof value === "string" && /^\/[A-Za-z0-9/_-]*$/.test(value);
}

function isHopePlanStep(value: unknown): value is HopePlanStep {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const step = value as Record<string, unknown>;
  return (
    typeof step.id === "string" &&
    step.id.trim().length > 0 &&
    typeof step.title === "string" &&
    step.title.trim().length > 0 &&
    typeof step.detail === "string" &&
    isSafeRoute(step.href) &&
    Number.isSafeInteger(step.minutes) &&
    Number(step.minutes) > 0 &&
    Number(step.minutes) <= 240
  );
}

export function normalizeHopePlanSnapshot(value: unknown): HopePlan | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const plan = value as Record<string, unknown>;
  if (
    typeof plan.title !== "string" ||
    typeof plan.summary !== "string" ||
    !FOCUS_VALUES.has(plan.focus as HopeFocus) ||
    !Number.isSafeInteger(plan.sprintMinutes) ||
    Number(plan.sprintMinutes) <= 0 ||
    !Array.isArray(plan.steps) ||
    plan.steps.length === 0 ||
    plan.steps.length > 6 ||
    !plan.steps.every(isHopePlanStep) ||
    typeof plan.coachNote !== "string" ||
    plan.provenance !== "deterministic-local-planner"
  ) {
    return null;
  }

  const stepIds = plan.steps.map(step => (step as HopePlanStep).id);
  if (new Set(stepIds).size !== stepIds.length) return null;

  return plan as unknown as HopePlan;
}

export function normalizeHopeCompletedStepIds(
  plan: HopePlan,
  value: unknown
): string[] {
  if (!Array.isArray(value)) return [];
  const valid = new Set(plan.steps.map(step => step.id));
  return Array.from(
    new Set(
      value.filter(
        (stepId): stepId is string =>
          typeof stepId === "string" && valid.has(stepId)
      )
    )
  );
}

export function isHopeSprintComplete(
  plan: HopePlan | null,
  completedStepIds: readonly string[]
) {
  if (!plan || plan.steps.length === 0) return false;
  const completed = new Set(completedStepIds);
  return plan.steps.every(step => completed.has(step.id));
}

export function getHopeIncompleteSteps(
  plan: HopePlan | null,
  completedStepIds: readonly string[]
) {
  if (!plan) return [];
  const completed = new Set(completedStepIds);
  return plan.steps.filter(step => !completed.has(step.id));
}

export function recommendHopeNextAction(
  activity: HopeActivitySummary,
  currentFocus: HopeFocus
): HopeSprintNextAction {
  if (activity.lessons === 0) {
    return {
      focus: "learn",
      title: "Create durable learning evidence",
      href: "/course-catalog",
      reason:
        "No completed lesson is present in the supplied account activity evidence, so the next bounded loop is one authored lesson.",
    };
  }

  if (activity.posts === 0) {
    return {
      focus: "build",
      title: "Create one persisted community record",
      href: "/activity-feed",
      reason:
        "No persisted social post is present in the supplied account activity evidence, so publish and review one concise beta update.",
    };
  }

  if (activity.feedback === 0) {
    return {
      focus: "ship",
      title: "Close one tester feedback loop",
      href: "/beta-feedback",
      reason:
        "No submitted feedback is present in the supplied account activity evidence, so capture one reproducible product gap next.",
    };
  }

  const rotation: Record<HopeFocus, HopeSprintNextAction> = {
    build: {
      focus: "learn",
      title: "Switch from building to learning",
      href: "/sky-school",
      reason:
        "The core evidence types are already represented, so rotate focus instead of inventing a missing signal.",
    },
    learn: {
      focus: "play",
      title: "Turn recall into a short play loop",
      href: "/gaming",
      reason:
        "The core evidence types are already represented, so rotate into a bounded replayable skill loop.",
    },
    play: {
      focus: "ship",
      title: "Turn play findings into a tester report",
      href: "/beta-feedback",
      reason:
        "The core evidence types are already represented, so use the next sprint to close a concrete product-quality finding.",
    },
    ship: {
      focus: "build",
      title: "Start the next smallest visible improvement",
      href: "/beta-workspace",
      reason:
        "The core evidence types are already represented, so return to a bounded build loop for the next iteration.",
    },
  };

  return rotation[currentFocus];
}

function stableReceiptId(plan: HopePlan) {
  const source = [plan.focus, plan.title, ...plan.steps.map(step => step.id)].join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `hope-sprint:${(hash >>> 0).toString(36)}`;
}

export function createHopeSprintReceipt(input: {
  plan: HopePlan;
  completedStepIds: readonly string[];
  reflection: string;
  activity: HopeActivitySummary;
  completedAt?: string;
}): HopeSprintReceipt {
  const completedStepIds = normalizeHopeCompletedStepIds(
    input.plan,
    input.completedStepIds
  );
  if (!isHopeSprintComplete(input.plan, completedStepIds)) {
    throw new Error("All sprint steps must be tester-confirmed before closure.");
  }

  const reflection = normalizeText(input.reflection, 500);
  if (reflection.length < 5) {
    throw new Error("Reflection must be at least 5 characters.");
  }

  const completedAt = input.completedAt ?? new Date().toISOString();
  if (!Number.isFinite(Date.parse(completedAt))) {
    throw new Error("completedAt must be a valid timestamp.");
  }

  return Object.freeze({
    id: stableReceiptId(input.plan),
    planTitle: normalizeText(input.plan.title, 520),
    focus: input.plan.focus,
    completedStepIds: Object.freeze(completedStepIds),
    stepCount: input.plan.steps.length,
    reflection,
    completedAt,
    nextAction: Object.freeze(
      recommendHopeNextAction(input.activity, input.plan.focus)
    ),
    provenance: "tester-confirmed-local-receipt",
  });
}

function normalizeNextAction(value: unknown): HopeSprintNextAction | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const action = value as Record<string, unknown>;
  if (
    !FOCUS_VALUES.has(action.focus as HopeFocus) ||
    typeof action.title !== "string" ||
    action.title.trim().length < 3 ||
    !isSafeRoute(action.href) ||
    typeof action.reason !== "string" ||
    action.reason.trim().length < 10
  ) {
    return null;
  }
  return {
    focus: action.focus as HopeFocus,
    title: normalizeText(action.title, 160),
    href: action.href,
    reason: normalizeText(action.reason, 500),
  };
}

function normalizeReceipt(value: unknown): HopeSprintReceipt | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const receipt = value as Record<string, unknown>;
  const nextAction = normalizeNextAction(receipt.nextAction);
  if (
    typeof receipt.id !== "string" ||
    !receipt.id.startsWith("hope-sprint:") ||
    typeof receipt.planTitle !== "string" ||
    receipt.planTitle.trim().length < 3 ||
    !FOCUS_VALUES.has(receipt.focus as HopeFocus) ||
    !Array.isArray(receipt.completedStepIds) ||
    !receipt.completedStepIds.every(id => typeof id === "string" && id.length > 0) ||
    !Number.isSafeInteger(receipt.stepCount) ||
    Number(receipt.stepCount) <= 0 ||
    Number(receipt.stepCount) > 6 ||
    typeof receipt.reflection !== "string" ||
    normalizeText(receipt.reflection, 500).length < 5 ||
    typeof receipt.completedAt !== "string" ||
    !Number.isFinite(Date.parse(receipt.completedAt)) ||
    receipt.provenance !== "tester-confirmed-local-receipt" ||
    !nextAction
  ) {
    return null;
  }

  const completedStepIds = Array.from(
    new Set(receipt.completedStepIds as string[])
  ).slice(0, Number(receipt.stepCount));
  if (completedStepIds.length !== Number(receipt.stepCount)) return null;

  return {
    id: receipt.id,
    planTitle: normalizeText(receipt.planTitle, 520),
    focus: receipt.focus as HopeFocus,
    completedStepIds,
    stepCount: Number(receipt.stepCount),
    reflection: normalizeText(receipt.reflection, 500),
    completedAt: receipt.completedAt,
    nextAction,
    provenance: "tester-confirmed-local-receipt",
  };
}

export function normalizeHopeSprintHistory(value: unknown): HopeSprintReceipt[] {
  if (!Array.isArray(value)) return [];
  const byId = new Map<string, HopeSprintReceipt>();
  for (const candidate of value) {
    const receipt = normalizeReceipt(candidate);
    if (!receipt || byId.has(receipt.id)) continue;
    byId.set(receipt.id, receipt);
  }
  return Array.from(byId.values())
    .sort((left, right) =>
      right.completedAt.localeCompare(left.completedAt)
    )
    .slice(0, HOPE_SPRINT_HISTORY_LIMIT);
}

export function upsertHopeSprintReceipt(
  history: readonly HopeSprintReceipt[],
  receipt: HopeSprintReceipt
) {
  return normalizeHopeSprintHistory([
    receipt,
    ...history.filter(existing => existing.id !== receipt.id),
  ]);
}

export function removeHopeSprintReceipt(
  history: readonly HopeSprintReceipt[],
  receiptId: string
) {
  return normalizeHopeSprintHistory(
    history.filter(receipt => receipt.id !== receiptId)
  );
}
