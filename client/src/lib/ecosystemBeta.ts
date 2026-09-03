export type EcosystemAreaId =
  "social" | "live" | "finance" | "commerce" | "language" | "dating";

export type EcosystemArea = {
  id: EcosystemAreaId;
  name: string;
  inspiration: string;
  description: string;
  route: string;
  status: "Working beta" | "Local test lab" | "Controlled sandbox";
  testGoal: string;
  boundary: string;
};

export const ECOSYSTEM_BETA_PROGRESS_KEY =
  "sky4444.competitive-ecosystem-beta-progress";

export const ecosystemAreas: readonly EcosystemArea[] = [
  {
    id: "social",
    name: "Social & community",
    inspiration: "Facebook-style participation",
    description:
      "Publish persisted posts, react, reply, create communities, and review your account-owned activity.",
    route: "/activity-feed",
    status: "Working beta",
    testGoal:
      "Publish one post, react, reply, and confirm it survives refresh.",
    boundary:
      "No claim of Facebook-scale reach, recommendation quality, or moderation coverage.",
  },
  {
    id: "live",
    name: "Creator live studio",
    inspiration: "Twitch-style creator setup",
    description:
      "Check camera and microphone permissions, preview devices, and save a stream brief locally.",
    route: "/live-streaming",
    status: "Local test lab",
    testGoal:
      "Preview your devices, toggle them, and restore a saved stream brief.",
    boundary:
      "No ingest, broadcast, recording, audience, chat, subscription, or revenue service.",
  },
  {
    id: "finance",
    name: "Digital-asset evidence",
    inspiration: "Coinbase-style clarity",
    description:
      "Inspect labeled local and testnet token/NFT fixtures while custody and chain writes stay off.",
    route: "/beta-web3",
    status: "Controlled sandbox",
    testGoal:
      "Identify the environment and confirm every execution control is gated.",
    boundary:
      "No wallet custody, signing, deposits, withdrawals, swaps, staking, settlement, or production chain execution.",
  },
  {
    id: "commerce",
    name: "Privacy-first commerce",
    inspiration: "Marketplace browsing without illicit trade",
    description:
      "Search a clearly labeled fixture catalog, build a local cart, and inspect deterministic checkout math.",
    route: "/beta-commerce",
    status: "Controlled sandbox",
    testGoal: "Build a cart, refresh it, and verify the deterministic quote.",
    boundary:
      "No real sellers, inventory, orders, payments, shipment, reviews, or prohibited-goods marketplace.",
  },
  {
    id: "language",
    name: "Language exchange",
    inspiration: "Tandem-style practice planning",
    description:
      "Build a language profile and generate a balanced, deterministic practice session.",
    route: "/language-partner-discovery",
    status: "Local test lab",
    testGoal:
      "Save a profile and generate a balanced two-language practice plan.",
    boundary:
      "No fabricated partners, matching, presence, messaging, calls, ratings, or identity verification.",
  },
  {
    id: "dating",
    name: "Dating profile",
    inspiration: "Safety-first profile onboarding",
    description:
      "Complete an adult-only profile draft with validation, session restore, and transparent storage.",
    route: "/dating-profile-setup",
    status: "Local test lab",
    testGoal: "Save a valid profile, reload, and confirm the draft restores.",
    boundary:
      "No matching, messaging, discovery, identity verification, server persistence, or safety-screening claim.",
  },
] as const;

export type EcosystemProgress = Partial<Record<EcosystemAreaId, boolean>>;

export function normalizeEcosystemProgress(value: unknown): EcosystemProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    ecosystemAreas.map(area => [
      area.id,
      (value as Record<string, unknown>)[area.id] === true,
    ])
  ) as EcosystemProgress;
}

export function setEcosystemAreaComplete(
  progress: EcosystemProgress,
  areaId: EcosystemAreaId,
  complete: boolean
): EcosystemProgress {
  return { ...normalizeEcosystemProgress(progress), [areaId]: complete };
}

export function getEcosystemProgressPercent(progress: EcosystemProgress) {
  const complete = ecosystemAreas.filter(area => progress[area.id]).length;
  return Math.round((complete / ecosystemAreas.length) * 100);
}
