import { getJourneyById, type V3JourneyId } from "@/lib/v3Journeys";

export type V4EvidenceMode =
  | "account-backed"
  | "local-persistent"
  | "networked-beta"
  | "deterministic-account-context"
  | "deterministic-simulation";

export type V4Flagship = Readonly<{
  id: V3JourneyId;
  name: string;
  entryRoute: string;
  evidenceMode: V4EvidenceMode;
  evidenceLabel: string;
  worksNow: readonly string[];
  boundary: string;
  sourceFile: string;
  releaseContract: string;
}>;

export type V4MissionId =
  | "connect"
  | "learn"
  | "play"
  | "commerce"
  | "verify";

export type V4Mission = Readonly<{
  id: V4MissionId;
  name: string;
  description: string;
  flagshipIds: readonly V3JourneyId[];
}>;

export type V4TestSession = Readonly<{
  missionId: V4MissionId;
  completedFlagships: readonly V3JourneyId[];
}>;

export const V4_TEST_SESSION_KEY = "sky4444.v4-test-session.v1";

export const v4Flagships: readonly V4Flagship[] = [
  {
    id: "social",
    name: "Social & Community",
    entryRoute: "/activity-feed",
    evidenceMode: "account-backed",
    evidenceLabel: "Persisted participation",
    worksNow: [
      "Account-backed posting and persisted feed records",
      "Comments, reactions, follow state, search, saves, and sharing",
      "Activity Evidence and privacy routes for review and control",
    ],
    boundary:
      "No claim of large-scale reach, universal moderation, verified identity, or production recommendation quality.",
    sourceFile: "client/src/pages/ActivityFeed.tsx",
    releaseContract: "tests/release/competitive-ecosystem-beta.test.ts",
  },
  {
    id: "gaming",
    name: "SkyGaming",
    entryRoute: "/gaming",
    evidenceMode: "local-persistent",
    evidenceLabel: "Playable deterministic loops",
    worksNow: [
      "Searchable authored game catalog and favorites",
      "Deterministic playable rounds with reset and feedback",
      "Arcade Passport progress with supported sync behavior",
    ],
    boundary:
      "No real-money wagering, custody, token payouts, production multiplayer, or public-ranking guarantee.",
    sourceFile: "client/src/pages/Gaming.tsx",
    releaseContract: "tests/release/arcade-passport-gaming.test.ts",
  },
  {
    id: "live",
    name: "SkyLive",
    entryRoute: "/live",
    evidenceMode: "networked-beta",
    evidenceLabel: "Real small-room WebRTC",
    worksNow: [
      "Authenticated room create/join lifecycle",
      "Browser media capture plus offer/answer/ICE signaling",
      "Room chat, media controls, heartbeat, and deliberate teardown",
    ],
    boundary:
      "Direct small-room WebRTC only; no server ingest, TURN guarantee, CDN distribution, VOD, payouts, or production-scale availability claim.",
    sourceFile: "client/src/pages/Live.tsx",
    releaseContract: "tests/release/competitive-ecosystem-beta.test.ts",
  },
  {
    id: "commerce",
    name: "SkyMarket Commerce",
    entryRoute: "/beta-commerce",
    evidenceMode: "local-persistent",
    evidenceLabel: "Deterministic browse-to-quote",
    worksNow: [
      "Fixture catalog search, filters, saved items, and cart persistence",
      "Bounded promo and delivery-cost rehearsal scenarios",
      "Deterministic checkout quote contract with visible breakdown",
    ],
    boundary:
      "No real sellers, inventory, address collection, payment, settlement, shipment, reviews, commissions, or prohibited-goods marketplace.",
    sourceFile: "client/src/pages/BetaCommerceSandbox.tsx",
    releaseContract: "tests/release/v3-commerce-depth.test.ts",
  },
  {
    id: "learning",
    name: "SkySchool",
    entryRoute: "/course-catalog",
    evidenceMode: "account-backed",
    evidenceLabel: "Account-owned course continuity",
    worksNow: [
      "Authored lessons with deterministic assessment feedback",
      "Protected lesson-completion persistence for signed-in beta accounts",
      "Account-wide next-lesson and next-course continuation",
    ],
    boundary:
      "No accreditation, credentials, proctoring, AI grading, token rewards, or universal proficiency claim.",
    sourceFile: "client/src/pages/CourseCatalog.tsx",
    releaseContract: "tests/release/v3-learning-continuity.test.ts",
  },
  {
    id: "ai",
    name: "HopeAI Coach",
    entryRoute: "/hope-a-i",
    evidenceMode: "deterministic-account-context",
    evidenceLabel: "Deterministic evidence coach",
    worksNow: [
      "Rule-based goal routing into supported beta product paths",
      "Account-owned activity evidence used as bounded planning context",
      "Evidence-gated sprint closure with browser-local reflections and next actions",
    ],
    boundary:
      "No external model/provider claim, hidden memory, emotional inference, autonomous execution, or production decision authority.",
    sourceFile: "client/src/pages/HopeAI.tsx",
    releaseContract: "tests/release/v3-hopeai-depth.test.ts",
  },
  {
    id: "web3",
    name: "Web3 Evidence Room",
    entryRoute: "/beta-web3",
    evidenceMode: "deterministic-simulation",
    evidenceLabel: "No-execution intent simulation",
    worksNow: [
      "Read-only local/testnet asset and protocol evidence",
      "Intent review with network, amount, and recovery-material guards",
      "Local simulation receipts proving no signature, broadcast, or custody occurred",
    ],
    boundary:
      "No wallet connection, private-key handling, real balance query, signing, broadcast, custody, transfer, settlement, or production-chain write.",
    sourceFile: "client/src/pages/BetaWeb3Sandbox.tsx",
    releaseContract: "tests/release/v3-web3-depth.test.ts",
  },
] as const;

export const v4Missions: readonly V4Mission[] = [
  {
    id: "connect",
    name: "Connect & create",
    description: "Publish something real, move into a small live room, then review the evidence trail.",
    flagshipIds: ["social", "live"],
  },
  {
    id: "learn",
    name: "Learn & act",
    description: "Complete authored learning work, then use HopeAI's deterministic coach to choose a bounded next action.",
    flagshipIds: ["learning", "ai"],
  },
  {
    id: "play",
    name: "Play & improve",
    description: "Run a replayable game loop, then carry the result into a social or feedback loop instead of ending on a score screen.",
    flagshipIds: ["gaming", "social"],
  },
  {
    id: "commerce",
    name: "Browse & quote",
    description: "Rehearse discovery, saving, cart state, promos, delivery planning, and quote math without executing payment or fulfillment.",
    flagshipIds: ["commerce"],
  },
  {
    id: "verify",
    name: "Inspect & verify",
    description: "Use Web3 safety simulation and authored learning to understand the boundary before any future high-risk integration.",
    flagshipIds: ["web3", "learning"],
  },
] as const;

const flagshipIds = new Set(v4Flagships.map(flagship => flagship.id));
const missionIds = new Set(v4Missions.map(mission => mission.id));

export function getV4Flagship(id: V3JourneyId) {
  return v4Flagships.find(flagship => flagship.id === id)!;
}

export function getV4Mission(id: V4MissionId) {
  return v4Missions.find(mission => mission.id === id)!;
}

export function getV4Journey(id: V3JourneyId) {
  return getJourneyById(id);
}

export function normalizeV4TestSession(value: unknown): V4TestSession {
  const fallback: V4TestSession = {
    missionId: "connect",
    completedFlagships: [],
  };

  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const candidate = value as Record<string, unknown>;
  const missionId =
    typeof candidate.missionId === "string" && missionIds.has(candidate.missionId as V4MissionId)
      ? (candidate.missionId as V4MissionId)
      : fallback.missionId;
  const completedFlagships = Array.isArray(candidate.completedFlagships)
    ? Array.from(
        new Set(
          candidate.completedFlagships.filter(
            (id): id is V3JourneyId =>
              typeof id === "string" && flagshipIds.has(id as V3JourneyId)
          )
        )
      )
    : [];

  return { missionId, completedFlagships };
}

export function setV4Mission(
  session: V4TestSession,
  missionId: V4MissionId
): V4TestSession {
  return {
    missionId,
    completedFlagships: session.completedFlagships,
  };
}

export function setV4FlagshipComplete(
  session: V4TestSession,
  flagshipId: V3JourneyId,
  complete: boolean
): V4TestSession {
  const completed = new Set(session.completedFlagships);
  if (complete) completed.add(flagshipId);
  else completed.delete(flagshipId);
  return {
    missionId: session.missionId,
    completedFlagships: [...completed].filter(id => flagshipIds.has(id)),
  };
}

export function getV4MissionProgress(session: V4TestSession) {
  const mission = getV4Mission(session.missionId);
  const completed = mission.flagshipIds.filter(id => session.completedFlagships.includes(id));
  const percent = mission.flagshipIds.length
    ? Math.round((completed.length / mission.flagshipIds.length) * 100)
    : 0;
  const nextFlagshipId = mission.flagshipIds.find(
    id => !session.completedFlagships.includes(id)
  ) ?? null;

  return {
    completedCount: completed.length,
    totalCount: mission.flagshipIds.length,
    percent,
    nextFlagshipId,
  } as const;
}
