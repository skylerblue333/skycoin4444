export type V3JourneyId =
  | "social"
  | "gaming"
  | "live"
  | "commerce"
  | "learning"
  | "ai"
  | "web3";

export type V3JourneyStage = {
  id: string;
  title: string;
  description: string;
  route: string;
  evidence: string;
};

export type V3Journey = {
  id: V3JourneyId;
  name: string;
  tagline: string;
  outcome: string;
  boundary: string;
  entryRoutes: readonly string[];
  stages: readonly V3JourneyStage[];
};

export type V3JourneyProgress = Partial<Record<V3JourneyId, string[]>>;

export const V3_JOURNEY_PROGRESS_KEY = "sky4444.v3-journey-progress.v1";

export const v3Journeys: readonly V3Journey[] = [
  {
    id: "social",
    name: "Social & Community",
    tagline: "From browsing to account-owned participation",
    outcome: "Finish with a persisted contribution, a real conversation, and a reviewable activity trail.",
    boundary: "No claim of large-scale reach, recommendation quality, universal moderation coverage, or verified identities.",
    entryRoutes: ["/activity-feed", "/community-hub"],
    stages: [
      { id: "discover", title: "Discover", description: "Browse the persisted feed, use filters, and inspect the public participation surface.", route: "/activity-feed", evidence: "The feed loads stored records and exposes honest empty/loading/error states." },
      { id: "publish", title: "Publish", description: "Create one account-owned post and verify the saved result after refresh.", route: "/activity-feed", evidence: "The post survives refresh under the documented beta persistence model." },
      { id: "converse", title: "Converse", description: "React, reply, follow, save, or share so the experience becomes a loop instead of a static feed.", route: "/activity-feed", evidence: "At least one persisted social interaction is visible after the action completes." },
      { id: "organize", title: "Organize", description: "Move from a feed into a community space and exercise the group-oriented path.", route: "/community-hub", evidence: "A community route loads and exposes its real supported participation controls." },
      { id: "review", title: "Review", description: "Inspect account-owned evidence instead of relying on invented engagement analytics.", route: "/activity-evidence", evidence: "The evidence surface reflects only records tied to supported beta activity." },
      { id: "control", title: "Control", description: "Review privacy, export, visibility, and deletion-request boundaries before treating the loop as complete.", route: "/privacy-settings", evidence: "Privacy controls clearly state what is persisted, exported, or only recorded as a request." },
    ],
  },
  {
    id: "gaming",
    name: "SkyGaming",
    tagline: "A replayable skill loop, not a wall of game cards",
    outcome: "Finish with a played session, visible feedback, a repeatable favorite, and a clear non-wagering boundary.",
    boundary: "No real-money wagering, custody, token payouts, blockchain settlement, durable public rankings, or production multiplayer claim.",
    entryRoutes: ["/gaming", "/arcade"],
    stages: [
      { id: "discover", title: "Discover", description: "Search and filter the authored game catalog until you find a game worth replaying.", route: "/gaming", evidence: "Search, categories, favorites, and empty-state recovery operate against the authored catalog." },
      { id: "play", title: "Play", description: "Complete a deterministic local round with visible state and a clean reset path.", route: "/arcade", evidence: "A playable local game accepts input, produces deterministic feedback, and can reset without financial execution." },
      { id: "score", title: "Read feedback", description: "Use score or skill-lab feedback to understand what happened instead of only seeing animation.", route: "/gaming", evidence: "The experience shows authored progress or correctness feedback grounded in local game state." },
      { id: "curate", title: "Curate", description: "Favorite a game and confirm the catalog can return you to it quickly.", route: "/gaming", evidence: "The favorite state is restored using the documented local or account-backed model." },
      { id: "repeat", title: "Repeat", description: "Replay a short session and verify reset/re-entry behavior feels intentional rather than disposable.", route: "/arcade", evidence: "A second session starts from the documented reset state without stale round leakage." },
      { id: "review", title: "Review", description: "Inspect supported activity evidence or submit an exact game-quality gap.", route: "/beta-feedback", evidence: "Feedback can name the game, route, and reproducible issue without claiming unsupported telemetry." },
    ],
  },
  {
    id: "live",
    name: "SkyLive",
    tagline: "A creator-room lifecycle from device check to teardown",
    outcome: "Finish with a room created or joined, real peer-media negotiation attempted, chat exercised, and the room deliberately ended.",
    boundary: "Small-room direct WebRTC only; no server ingest, transcoding, TURN guarantee, CDN distribution, recording/VOD, subscriptions, payouts, or production-scale availability claim.",
    entryRoutes: ["/live", "/channel-customization"],
    stages: [
      { id: "discover", title: "Discover", description: "Inspect current rooms and understand the difference between hosting and viewing.", route: "/live", evidence: "The room list comes from the live-room beta API and exposes loading/error states." },
      { id: "prepare", title: "Prepare devices", description: "Check camera and microphone access before opening a room.", route: "/live", evidence: "Permission, missing-device, and unsupported-browser failures are surfaced explicitly." },
      { id: "connect", title: "Connect", description: "Create or join a room and exercise the real offer/answer/ICE signaling path.", route: "/live", evidence: "Transport status reflects actual WebRTC signaling and connection state rather than a fake live indicator." },
      { id: "interact", title: "Interact", description: "Use room chat plus audio/video controls while the participant session is active.", route: "/live", evidence: "Chat and media controls change the active room session without inventing viewers." },
      { id: "shape", title: "Shape the channel", description: "Move into creator presentation settings after proving the room path itself.", route: "/channel-customization", evidence: "Channel presentation settings remain separate from unsupported public distribution or monetization claims." },
      { id: "close", title: "Close cleanly", description: "End or leave the room, release local tracks, and report any exact transport failure.", route: "/beta-feedback", evidence: "The room lifecycle has a deliberate teardown path and a reproducible feedback route." },
    ],
  },
  {
    id: "commerce",
    name: "SkyMarket Commerce",
    tagline: "A controlled browse-to-quote rehearsal",
    outcome: "Finish with a searched fixture catalog, a restored cart, and deterministic checkout math you can independently inspect.",
    boundary: "No real sellers, live inventory, payment processing, settlement, shipment, reviews, or prohibited-goods marketplace claim.",
    entryRoutes: ["/beta-commerce"],
    stages: [
      { id: "browse", title: "Browse", description: "Explore the labeled fixture catalog and identify exactly what data is simulated.", route: "/beta-commerce", evidence: "Products are explicitly labeled fixtures rather than implied real inventory." },
      { id: "search", title: "Search & compare", description: "Use discovery controls to narrow products before adding anything to a cart.", route: "/beta-commerce", evidence: "Search/filter behavior is deterministic against the controlled catalog." },
      { id: "cart", title: "Build a cart", description: "Add, remove, and change quantities so the commerce loop has meaningful state.", route: "/beta-commerce", evidence: "Cart state follows the documented local persistence behavior and restores after refresh where promised." },
      { id: "quote", title: "Inspect the quote", description: "Review subtotal and checkout math without crossing into real payment execution.", route: "/beta-commerce", evidence: "Quote math is deterministic and no live card, bank, crypto, or settlement action occurs." },
      { id: "privacy", title: "Review privacy", description: "Check what account or browser data the commerce rehearsal stores.", route: "/privacy-settings", evidence: "Storage and deletion boundaries are visible before the journey is treated as complete." },
      { id: "feedback", title: "Close the loop", description: "Report a catalog, cart, math, or persistence gap with the exact route and reproduction steps.", route: "/beta-feedback", evidence: "Feedback captures a concrete product-quality issue rather than fabricated conversion analytics." },
    ],
  },
  {
    id: "learning",
    name: "SkySchool Learning",
    tagline: "Course discovery, learning, assessment, progress, return",
    outcome: "Finish with an authored lesson completed, deterministic assessment feedback, and a clear next learning action.",
    boundary: "No claim of accreditation, proctored exams, universal credential recognition, or production-scale learning analytics.",
    entryRoutes: ["/course-catalog", "/sky-school"],
    stages: [
      { id: "discover", title: "Discover a course", description: "Browse authored learning content and choose a concrete lesson path.", route: "/course-catalog", evidence: "The catalog exposes authored material and a usable route into learning content." },
      { id: "learn", title: "Learn", description: "Complete one lesson unit instead of only browsing course cards.", route: "/sky-school", evidence: "The lesson presents authored instructional content with a clear completion action." },
      { id: "assess", title: "Assess", description: "Answer a deterministic assessment step and inspect correctness feedback.", route: "/sky-school", evidence: "Assessment feedback is derived from authored answers, not invented AI grading or accreditation." },
      { id: "review", title: "Review progress", description: "Inspect the documented progress model and verify what survives refresh or sign-in.", route: "/activity-evidence", evidence: "Only supported learning/activity evidence is shown; missing analytics are not fabricated." },
      { id: "continue", title: "Choose what is next", description: "Return to the catalog with a specific next course or lesson in mind.", route: "/course-catalog", evidence: "The loop has an intentional continuation path instead of ending on a dead screen." },
      { id: "feedback", title: "Improve the course", description: "Report unclear content, broken assessment logic, or persistence gaps.", route: "/beta-feedback", evidence: "Feedback names the exact course/lesson path and observable failure." },
    ],
  },
  {
    id: "ai",
    name: "HopeAI",
    tagline: "A bounded tool workflow with visible provider limits",
    outcome: "Finish with one supported AI/local-tool task completed, its boundary understood, and the result compared against the intended use.",
    boundary: "No claim of unavailable model/provider connectivity, autonomous external actions, durable memory, or production decision authority.",
    entryRoutes: ["/hope-a-i", "/a-i-tools-hub"],
    stages: [
      { id: "orient", title: "Orient", description: "Start in the verified HopeAI surface and identify which actions are local versus provider-backed.", route: "/hope-a-i", evidence: "The UI labels unavailable providers and does not simulate external model success." },
      { id: "choose", title: "Choose a tool", description: "Use the tools hub to select a bounded capability with a clear input and output.", route: "/a-i-tools-hub", evidence: "The selected tool has an explicit supported behavior rather than a generic AI promise." },
      { id: "execute", title: "Complete one task", description: "Run one supported local or configured task from input to result.", route: "/hope-a-i", evidence: "The result comes from the supported implementation path and failures remain visible." },
      { id: "inspect", title: "Inspect boundaries", description: "Review operational readiness before treating the result as production-grade automation.", route: "/operational-readiness", evidence: "Readiness separates repository evidence from external provider, uptime, security, or scale claims." },
      { id: "compare", title: "Compare the outcome", description: "Return to the tools hub and decide whether the output solved the intended task.", route: "/a-i-tools-hub", evidence: "The user can choose another tool or repeat the task without hidden success metrics." },
      { id: "feedback", title: "Report the gap", description: "Capture unsupported behavior, confusing boundaries, or a tool-quality defect.", route: "/beta-feedback", evidence: "Feedback distinguishes local implementation defects from missing external integrations." },
    ],
  },
  {
    id: "web3",
    name: "Digital Assets & Web3",
    tagline: "Evidence-first exploration with execution deliberately gated",
    outcome: "Finish able to identify the environment, inspect asset/chain evidence, and explain exactly why custody and production writes remain disabled.",
    boundary: "No wallet custody, signing, deposits, withdrawals, swaps, staking, settlement, or production-chain execution claim.",
    entryRoutes: ["/beta-web3"],
    stages: [
      { id: "environment", title: "Identify the environment", description: "Start by distinguishing local fixtures, testnet evidence, and anything not connected.", route: "/beta-web3", evidence: "Every displayed asset or chain signal is labeled with its evidence source and execution boundary." },
      { id: "assets", title: "Inspect assets", description: "Review the sandbox asset data without interpreting fixtures as live balances.", route: "/beta-web3", evidence: "Balances, tokens, or NFTs are clearly labeled local/test evidence rather than user custody." },
      { id: "explore", title: "Inspect chain data", description: "Use the explorer surface for read-oriented chain concepts and evidence.", route: "/chain-explorer", evidence: "Explorer data remains read-oriented and does not silently sign or broadcast transactions." },
      { id: "gate", title: "Verify execution gates", description: "Confirm signing, transfers, settlement, and production writes are unavailable unless separately proven.", route: "/operational-readiness", evidence: "Operational evidence explicitly keeps high-risk execution disabled where provider or custody proof is absent." },
      { id: "security", title: "Review safety", description: "Revisit the Web3 sandbox with recovery-material and destination-verification risks in mind.", route: "/beta-web3", evidence: "The experience never requests or pretends to protect real recovery material or private keys." },
      { id: "feedback", title: "Report an evidence gap", description: "Flag misleading environment labels, unsafe affordances, or unsupported execution claims.", route: "/beta-feedback", evidence: "Feedback can identify the exact control or label that needs correction." },
    ],
  },
] as const;

export function normalizeJourneyRoute(route: string) {
  const [path] = route.split(/[?#]/, 1);
  if (!path) return "/";
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function getJourneyById(journeyId: V3JourneyId) {
  return v3Journeys.find(journey => journey.id === journeyId)!;
}

export function findJourneyForRoute(route: string) {
  const normalized = normalizeJourneyRoute(route);
  return v3Journeys.find(journey => journey.entryRoutes.includes(normalized));
}

export function normalizeV3JourneyProgress(value: unknown): V3JourneyProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const candidate = value as Record<string, unknown>;
  const normalized: V3JourneyProgress = {};

  for (const journey of v3Journeys) {
    const raw = candidate[journey.id];
    if (!Array.isArray(raw)) continue;
    const validStageIds = new Set(journey.stages.map(stage => stage.id));
    normalized[journey.id] = Array.from(
      new Set(
        raw.filter(
          (stageId): stageId is string =>
            typeof stageId === "string" && validStageIds.has(stageId)
        )
      )
    );
  }

  return normalized;
}

export function setV3JourneyStageComplete(
  progress: V3JourneyProgress,
  journeyId: V3JourneyId,
  stageId: string,
  complete: boolean
): V3JourneyProgress {
  const normalized = normalizeV3JourneyProgress(progress);
  const journey = getJourneyById(journeyId);
  if (!journey.stages.some(stage => stage.id === stageId)) return normalized;
  const current = normalized[journeyId] ?? [];
  const next = complete
    ? Array.from(new Set([...current, stageId]))
    : current.filter(item => item !== stageId);
  return { ...normalized, [journeyId]: next };
}

export function getV3JourneyCompletionPercent(
  progress: V3JourneyProgress,
  journeyId: V3JourneyId
) {
  const journey = getJourneyById(journeyId);
  const complete = new Set(normalizeV3JourneyProgress(progress)[journeyId] ?? []);
  return Math.round(
    (journey.stages.filter(stage => complete.has(stage.id)).length /
      journey.stages.length) *
      100
  );
}

export function getNextV3JourneyStage(
  progress: V3JourneyProgress,
  journeyId: V3JourneyId
) {
  const journey = getJourneyById(journeyId);
  const complete = new Set(normalizeV3JourneyProgress(progress)[journeyId] ?? []);
  return journey.stages.find(stage => !complete.has(stage.id)) ?? journey.stages[0];
}
