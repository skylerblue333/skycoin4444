import type { V3JourneyId } from "@/lib/v3Journeys";

export type V4DemoTrackId =
  | "ultimate"
  | "guest"
  | "creator"
  | "learn"
  | "trust";

export type V4DemoStep = Readonly<{
  id: string;
  flagshipId: V3JourneyId;
  title: string;
  promise: string;
  route: string;
  actionLabel: string;
  proof: string;
}>;

export type V4DemoTrack = Readonly<{
  id: V4DemoTrackId;
  name: string;
  duration: string;
  description: string;
  requiresAccount: boolean;
  stepIds: readonly string[];
}>;

export type V4DemoSession = Readonly<{
  trackId: V4DemoTrackId;
  visitedStepIds: readonly string[];
}>;

export const V4_DEMO_SESSION_KEY = "sky4444.v4-demo-session.v1";

export const v4DemoSteps: readonly V4DemoStep[] = [
  {
    id: "social-publish",
    flagshipId: "social",
    title: "Publish and connect",
    promise: "Start with a real account-backed social action instead of a marketing slide.",
    route: "/activity-feed",
    actionLabel: "Open Social",
    proof:
      "Publish or interact, then confirm the activity can be reviewed through the account-owned evidence trail.",
  },
  {
    id: "live-room",
    flagshipId: "live",
    title: "Enter a real live room",
    promise: "Move from the feed into direct browser-to-browser media, chat, and room lifecycle.",
    route: "/live",
    actionLabel: "Open SkyLive",
    proof:
      "Create or join a room, exercise camera/microphone controls and chat, then deliberately leave the room.",
  },
  {
    id: "learning-continuity",
    flagshipId: "learning",
    title: "Learn and come back",
    promise: "Show authored learning with account-owned continuity instead of disconnected quiz screens.",
    route: "/course-catalog",
    actionLabel: "Open SkySchool",
    proof:
      "Complete authored lesson work while signed in and confirm the catalog can point to the next unfinished work.",
  },
  {
    id: "hope-next-action",
    flagshipId: "ai",
    title: "Turn evidence into a next action",
    promise: "Use HopeAI as an honest deterministic coach over supported account context.",
    route: "/hope-a-i",
    actionLabel: "Open HopeAI",
    proof:
      "Create a bounded sprint, complete its real steps, save a local closure reflection, and open the suggested next route.",
  },
  {
    id: "gaming-replay",
    flagshipId: "gaming",
    title: "Play, replay, progress",
    promise: "Demonstrate an authored game loop with feedback and progression rather than a catalog card.",
    route: "/gaming",
    actionLabel: "Open SkyGaming",
    proof:
      "Finish an authored game run, replay or reset it, and inspect supported Arcade Passport progression.",
  },
  {
    id: "commerce-quote",
    flagshipId: "commerce",
    title: "Browse all the way to a quote",
    promise: "Show commerce discovery, saved state, cart math, and planning without pretending payment exists.",
    route: "/beta-commerce",
    actionLabel: "Open SkyMarket",
    proof:
      "Search or save an item, move it into the cart, apply a fixture promo/delivery scenario, and inspect the deterministic quote.",
  },
  {
    id: "web3-simulation",
    flagshipId: "web3",
    title: "Simulate Web3 without risking keys",
    promise: "End on a safety-first intent review that proves what did not happen as clearly as what did.",
    route: "/beta-web3",
    actionLabel: "Open Web3 Lab",
    proof:
      "Build a bounded intent, satisfy the safety acknowledgements, and create a receipt that records no signature, broadcast, or custody.",
  },
] as const;

export const v4DemoTracks: readonly V4DemoTrack[] = [
  {
    id: "ultimate",
    name: "Ultimate V4 demo",
    duration: "10–15 min",
    description:
      "Seven product moments in one story: connect, communicate, learn, act, play, quote, and verify.",
    requiresAccount: true,
    stepIds: [
      "social-publish",
      "live-room",
      "learning-continuity",
      "hope-next-action",
      "gaming-replay",
      "commerce-quote",
      "web3-simulation",
    ],
  },
  {
    id: "guest",
    name: "Guest preview",
    duration: "4–6 min",
    description:
      "No-account preview of the strongest local loops: play an authored game, build a commerce quote, and simulate a safety-gated Web3 intent.",
    requiresAccount: false,
    stepIds: ["gaming-replay", "commerce-quote", "web3-simulation"],
  },
  {
    id: "creator",
    name: "Creator demo",
    duration: "5–7 min",
    description:
      "Show the strongest creation-to-audience arc: publish, enter a live room, then rehearse commerce discovery and quote planning.",
    requiresAccount: true,
    stepIds: ["social-publish", "live-room", "commerce-quote"],
  },
  {
    id: "learn",
    name: "Learning demo",
    duration: "5–7 min",
    description:
      "Show continuity from authored learning into a deterministic next-action coach and a replayable practice loop.",
    requiresAccount: true,
    stepIds: ["learning-continuity", "hope-next-action", "gaming-replay"],
  },
  {
    id: "trust",
    name: "Trust demo",
    duration: "4–6 min",
    description:
      "Show evidence-first product boundaries: account activity, safe commerce math, and Web3 simulation with execution disabled.",
    requiresAccount: true,
    stepIds: ["social-publish", "commerce-quote", "web3-simulation"],
  },
] as const;

const demoStepIds = new Set(v4DemoSteps.map(step => step.id));
const demoTrackIds = new Set(v4DemoTracks.map(track => track.id));

export function getV4DemoStep(id: string) {
  return v4DemoSteps.find(step => step.id === id)!;
}

export function getV4DemoTrack(id: V4DemoTrackId) {
  return v4DemoTracks.find(track => track.id === id)!;
}

export function getV4DemoTrackSteps(id: V4DemoTrackId) {
  return getV4DemoTrack(id).stepIds.map(getV4DemoStep);
}

export function normalizeV4DemoSession(value: unknown): V4DemoSession {
  const fallback: V4DemoSession = { trackId: "ultimate", visitedStepIds: [] };
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;

  const candidate = value as Record<string, unknown>;
  const trackId =
    typeof candidate.trackId === "string" &&
    demoTrackIds.has(candidate.trackId as V4DemoTrackId)
      ? (candidate.trackId as V4DemoTrackId)
      : fallback.trackId;
  const visitedStepIds = Array.isArray(candidate.visitedStepIds)
    ? Array.from(
        new Set(
          candidate.visitedStepIds.filter(
            (id): id is string => typeof id === "string" && demoStepIds.has(id)
          )
        )
      )
    : [];

  return { trackId, visitedStepIds };
}

export function setV4DemoTrack(
  session: V4DemoSession,
  trackId: V4DemoTrackId
): V4DemoSession {
  return { trackId, visitedStepIds: session.visitedStepIds };
}

export function markV4DemoStepVisited(
  session: V4DemoSession,
  stepId: string
): V4DemoSession {
  if (!demoStepIds.has(stepId)) return session;
  return {
    trackId: session.trackId,
    visitedStepIds: Array.from(new Set([...session.visitedStepIds, stepId])),
  };
}

export function resetV4DemoSession(session: V4DemoSession): V4DemoSession {
  return { trackId: session.trackId, visitedStepIds: [] };
}

export function getV4DemoProgress(session: V4DemoSession) {
  const steps = getV4DemoTrackSteps(session.trackId);
  const visitedCount = steps.filter(step => session.visitedStepIds.includes(step.id)).length;
  const nextStep = steps.find(step => !session.visitedStepIds.includes(step.id)) ?? null;
  return {
    visitedCount,
    totalCount: steps.length,
    percent: steps.length ? Math.round((visitedCount / steps.length) * 100) : 0,
    nextStep,
  } as const;
}