export type ImpactTrackId =
  | "shelter-care"
  | "food-essentials"
  | "education-access"
  | "digital-access"
  | "community-checkin";

export type ImpactTrack = {
  id: ImpactTrackId;
  name: string;
  description: string;
  unitLabel: string;
  minutesPerUnit: number;
  starterSteps: readonly string[];
  evidenceIdeas: readonly string[];
};

export type ImpactPlanInput = {
  trackId: ImpactTrackId;
  availableMinutes: number;
  teamSize: number;
};

export type ImpactPlan = {
  track: ImpactTrack;
  availableMinutes: number;
  teamSize: number;
  plannedUnits: number;
  rolePlan: readonly string[];
  steps: readonly string[];
  evidenceChecklist: readonly string[];
  receiptId: string;
};

export type ImpactJournalEntry = {
  id: string;
  receiptId: string;
  trackId: ImpactTrackId;
  trackName: string;
  availableMinutes: number;
  teamSize: number;
  plannedUnits: number;
  createdAt: number;
  completed: boolean;
};

export const IMPACT_TRACKS: readonly ImpactTrack[] = [
  {
    id: "shelter-care",
    name: "Shelter care",
    description:
      "Plan a practical service block for an established shelter or community-care organization.",
    unitLabel: "service blocks",
    minutesPerUnit: 45,
    starterSteps: [
      "Choose a real organization and confirm its current volunteer rules directly.",
      "Pick one bounded task the organization actually needs.",
      "Complete the task only after staff approval and follow local safety rules.",
      "Record what was completed without exposing private information about people served.",
    ],
    evidenceIdeas: [
      "Organization-approved task list or public volunteer instructions",
      "Personal completion note with date and duration",
      "Optional non-sensitive receipt or confirmation supplied by the organization",
    ],
  },
  {
    id: "food-essentials",
    name: "Food essentials",
    description:
      "Plan sorting, packing, pantry support, or another organization-approved food-assistance task.",
    unitLabel: "packing blocks",
    minutesPerUnit: 30,
    starterSteps: [
      "Confirm what a local pantry or food bank currently accepts and needs.",
      "Choose a task that can be completed within the available time.",
      "Keep food-safety, handling, and privacy rules ahead of speed or quantity.",
      "Log only the work you personally completed or directly verified.",
    ],
    evidenceIdeas: [
      "Current public needs list",
      "Personal time log",
      "Organization-issued confirmation when available",
    ],
  },
  {
    id: "education-access",
    name: "Education access",
    description:
      "Plan tutoring, study support, supply preparation, or digital-literacy help through a real program.",
    unitLabel: "learning blocks",
    minutesPerUnit: 40,
    starterSteps: [
      "Choose an established school, library, nonprofit, or supervised program.",
      "Define one age-appropriate learning objective.",
      "Use only approved materials and follow supervision requirements.",
      "Write a private reflection focused on the lesson, not the learner's identity.",
    ],
    evidenceIdeas: [
      "Lesson or activity outline",
      "Personal reflection",
      "Program confirmation where appropriate",
    ],
  },
  {
    id: "digital-access",
    name: "Digital access",
    description:
      "Plan a bounded device-setup, account-safety, or digital-literacy support session.",
    unitLabel: "support blocks",
    minutesPerUnit: 35,
    starterSteps: [
      "Confirm the person or organization wants help before touching a device or account.",
      "Never request or retain passwords, recovery phrases, private keys, or sensitive credentials.",
      "Teach the user to perform sensitive steps themselves.",
      "Document only the non-sensitive task outcome.",
    ],
    evidenceIdeas: [
      "Non-sensitive checklist",
      "User-approved task summary",
      "Personal time log",
    ],
  },
  {
    id: "community-checkin",
    name: "Community check-in",
    description:
      "Plan a neighbor, elder, peer, or community-support check-in through a safe and consent-based channel.",
    unitLabel: "check-in blocks",
    minutesPerUnit: 20,
    starterSteps: [
      "Choose a consent-based check-in method and respect boundaries.",
      "Ask what support would actually be useful instead of assuming.",
      "Escalate urgent safety needs to appropriate local services rather than improvising.",
      "Keep notes minimal and private.",
    ],
    evidenceIdeas: [
      "Personal time log",
      "Non-sensitive follow-up reminder",
      "Resource list shared with consent",
    ],
  },
] as const;

const asBoundedInteger = (
  value: number,
  minimum: number,
  maximum: number
): number => {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
};

const stableHash = (value: string): string => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).padStart(7, "0");
};

export const findImpactTrack = (trackId: ImpactTrackId): ImpactTrack =>
  IMPACT_TRACKS.find(track => track.id === trackId) ?? IMPACT_TRACKS[0];

export const buildImpactPlan = (input: ImpactPlanInput): ImpactPlan => {
  const track = findImpactTrack(input.trackId);
  const availableMinutes = asBoundedInteger(input.availableMinutes, 15, 480);
  const teamSize = asBoundedInteger(input.teamSize, 1, 20);
  const capacityMinutes = availableMinutes * teamSize;
  const plannedUnits = Math.max(
    1,
    Math.floor(capacityMinutes / track.minutesPerUnit)
  );

  const rolePlan =
    teamSize === 1
      ? ["Solo volunteer: confirm scope, complete the task, and record evidence."]
      : [
          "Coordinator: confirms scope, safety rules, and handoff.",
          "Service team: completes the approved task.",
          ...(teamSize >= 3
            ? ["Recorder: keeps a minimal, non-sensitive completion log."]
            : []),
        ];

  const receiptId =
    "hope-" +
    stableHash(
      [track.id, availableMinutes, teamSize, plannedUnits].join(":")
    );

  return {
    track,
    availableMinutes,
    teamSize,
    plannedUnits,
    rolePlan,
    steps: track.starterSteps,
    evidenceChecklist: track.evidenceIdeas,
    receiptId,
  };
};

export const createImpactJournalEntry = (
  plan: ImpactPlan,
  now: number = Date.now()
): ImpactJournalEntry => ({
  id: "impact-" + Math.max(0, Math.trunc(now)).toString(36) + "-" + plan.receiptId,
  receiptId: plan.receiptId,
  trackId: plan.track.id,
  trackName: plan.track.name,
  availableMinutes: plan.availableMinutes,
  teamSize: plan.teamSize,
  plannedUnits: plan.plannedUnits,
  createdAt: Math.max(0, Math.trunc(now)),
  completed: false,
});

export const parseImpactJournal = (raw: string | null): ImpactJournalEntry[] => {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry): entry is ImpactJournalEntry => {
        if (!entry || typeof entry !== "object") return false;
        const candidate = entry as Partial<ImpactJournalEntry>;
        return (
          typeof candidate.id === "string" &&
          typeof candidate.receiptId === "string" &&
          IMPACT_TRACKS.some(track => track.id === candidate.trackId) &&
          typeof candidate.trackName === "string" &&
          typeof candidate.availableMinutes === "number" &&
          typeof candidate.teamSize === "number" &&
          typeof candidate.plannedUnits === "number" &&
          typeof candidate.createdAt === "number" &&
          typeof candidate.completed === "boolean"
        );
      })
      .slice(0, 50);
  } catch {
    return [];
  }
};
