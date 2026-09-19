export type BetaExperienceStatus = "core_beta" | "controlled_beta" | "preview";

export type BetaExperienceCategory =
  | "connect"
  | "create"
  | "learn"
  | "play"
  | "money"
  | "work"
  | "impact";

export interface BetaExperienceLink {
  label: string;
  route: string;
  note: string;
}

export interface BetaExperienceArea {
  id: string;
  name: string;
  eyebrow: string;
  category: BetaExperienceCategory;
  status: BetaExperienceStatus;
  description: string;
  route: string;
  action: string;
  highlights: readonly BetaExperienceLink[];
  searchTerms: readonly string[];
}

/**
 * Product-facing information architecture for the invitation-only beta.
 *
 * This is intentionally different from the engineering area registry. The
 * engineering registry describes evidence/readiness boundaries; this file
 * describes how a beta tester should discover the platform. A route appearing
 * here means it is a supported discovery entry point, not that every downstream
 * integration or external side effect is production-ready.
 */
export const betaExperienceAreas: readonly BetaExperienceArea[] = [
  {
    id: "social",
    name: "Social",
    eyebrow: "Feed · communities · profiles",
    category: "connect",
    status: "core_beta",
    description:
      "Follow activity, discover people and communities, and move through the social side of SKYCOIN4444 without digging through hundreds of screens.",
    route: "/activity-feed",
    action: "Open Social",
    highlights: [
      { label: "Community", route: "/community", note: "Topic spaces and community discovery" },
      { label: "Profiles", route: "/user-profile", note: "Identity and public profile surface" },
      { label: "Trending", route: "/trending", note: "Discover active topics and content" },
    ],
    searchTerms: ["feed", "friends", "community", "profile", "posts", "social"],
  },
  {
    id: "chat-calls",
    name: "Chat & Calls",
    eyebrow: "Messages · video · voice",
    category: "connect",
    status: "core_beta",
    description:
      "A single communication area for direct messaging, richer conversations, voice messages, and video-call entry points.",
    route: "/unified-messaging",
    action: "Open Chat",
    highlights: [
      { label: "Messages", route: "/messages", note: "Direct-message inbox" },
      { label: "Video call", route: "/video-call", note: "Video-call experience" },
      { label: "Voice messages", route: "/voice-messages", note: "Voice-message surface" },
    ],
    searchTerms: ["chat", "message", "dm", "video", "call", "voice"],
  },
  {
    id: "gaming",
    name: "Gaming",
    eyebrow: "Arcade · multiplayer · competition",
    category: "play",
    status: "core_beta",
    description:
      "Start with the game center, then move into arcade titles, multiplayer flows, leaderboards, and the expanding game catalog.",
    route: "/gaming",
    action: "Play",
    highlights: [
      { label: "Arcade", route: "/arcade", note: "Fast game launcher" },
      { label: "Leaderboard", route: "/leaderboard", note: "Scores and competition" },
      { label: "Multiplayer", route: "/multiplayer-lobby", note: "Multiplayer lobby surface" },
    ],
    searchTerms: ["games", "gaming", "arcade", "blackjack", "roulette", "multiplayer"],
  },
  {
    id: "hopeai",
    name: "HopeAI",
    eyebrow: "Assistant · tools · workflows",
    category: "create",
    status: "controlled_beta",
    description:
      "Discover the HopeAI assistant and AI creation tools through one clear entry point, with provider-dependent behavior kept inside controlled beta boundaries.",
    route: "/hope-a-i",
    action: "Open HopeAI",
    highlights: [
      { label: "AI assistant", route: "/a-i-assistant", note: "Assistant experience" },
      { label: "Code studio", route: "/a-i-code-studio", note: "AI-assisted coding surface" },
      { label: "Workflow builder", route: "/workflow-builder", note: "Build reusable workflows" },
    ],
    searchTerms: ["ai", "hope", "assistant", "agent", "code", "workflow"],
  },
  {
    id: "wallet-web3",
    name: "Wallet & Web3",
    eyebrow: "Wallet · portfolio · chain tools",
    category: "money",
    status: "controlled_beta",
    description:
      "Explore wallet and Web3 interfaces in test/read-only boundaries. The beta does not imply live custody, settlement, or blockchain execution.",
    route: "/beta-web3",
    action: "Open Web3 sandbox",
    highlights: [
      { label: "Wallet", route: "/wallet", note: "Wallet interface" },
      { label: "Wallet overview", route: "/wallet-overview", note: "Portfolio-style overview" },
      { label: "Chain explorer", route: "/chain-explorer", note: "Blockchain exploration surface" },
    ],
    searchTerms: ["crypto", "wallet", "web3", "blockchain", "portfolio", "token"],
  },
  {
    id: "marketplace",
    name: "Marketplace",
    eyebrow: "Discover · shop · checkout",
    category: "money",
    status: "controlled_beta",
    description:
      "Browse the commerce experience and test shopping flows without implying live merchant settlement or production payment processing.",
    route: "/beta-commerce",
    action: "Open Market sandbox",
    highlights: [
      { label: "Marketplace", route: "/marketplace", note: "Browse products and listings" },
      { label: "Wishlist", route: "/wishlist-management", note: "Save items for later" },
      { label: "Checkout", route: "/checkout", note: "Checkout UI flow" },
    ],
    searchTerms: ["market", "shop", "shopping", "commerce", "checkout", "store"],
  },
  {
    id: "school-language",
    name: "SkySchool & Language",
    eyebrow: "Courses · practice · language exchange",
    category: "learn",
    status: "core_beta",
    description:
      "Bring courses, learning paths, quizzes, and language-partner discovery together as one learning experience.",
    route: "/sky-school",
    action: "Start learning",
    highlights: [
      { label: "Learning", route: "/learning", note: "Learning dashboard" },
      { label: "Language partners", route: "/language-partner-discovery", note: "Find language partners" },
      { label: "Quizzes", route: "/quizzes", note: "Knowledge checks and practice" },
    ],
    searchTerms: ["school", "course", "quiz", "learn", "language", "education"],
  },
  {
    id: "live",
    name: "Live",
    eyebrow: "Streams · reactions · VOD",
    category: "create",
    status: "core_beta",
    description:
      "A creator-first live area for discovering streams, testing live interactions, and moving into creator broadcasting tools.",
    route: "/live",
    action: "Open Live",
    highlights: [
      { label: "Live streaming", route: "/live-streaming", note: "Streaming experience" },
      { label: "Creator dashboard", route: "/livestream-dashboard", note: "Stream management surface" },
      { label: "VOD archive", route: "/v-o-d-archive", note: "Recorded-content library" },
    ],
    searchTerms: ["live", "stream", "streaming", "creator", "video", "vod"],
  },
  {
    id: "dating",
    name: "Dating",
    eyebrow: "Discover · match · chat",
    category: "connect",
    status: "core_beta",
    description:
      "Move from discovery to matching and match chat through a dedicated dating experience rather than scattered relationship screens.",
    route: "/dating-home",
    action: "Open Dating",
    highlights: [
      { label: "Match feed", route: "/match-feed", note: "Dating discovery surface" },
      { label: "Matchmaking", route: "/matchmaking", note: "Matching experience" },
      { label: "Match chat", route: "/match-chat", note: "Conversation after a match" },
    ],
    searchTerms: ["dating", "match", "relationship", "discover", "chat"],
  },
  {
    id: "global",
    name: "Global Community",
    eyebrow: "Translation · language · culture",
    category: "connect",
    status: "core_beta",
    description:
      "Use translation-enabled community surfaces and language tools to make cross-language conversation a first-class part of the platform.",
    route: "/translation-enabled-community",
    action: "Go Global",
    highlights: [
      { label: "Translated feed", route: "/translation-enabled-social-feed", note: "Translation-aware social feed" },
      { label: "Language partners", route: "/language-partner-discovery", note: "Language exchange discovery" },
      { label: "Language selector", route: "/language-selector", note: "Language preferences" },
    ],
    searchTerms: ["global", "translation", "language", "exchange", "culture", "international"],
  },
  {
    id: "creator",
    name: "Creator Studio",
    eyebrow: "Publish · media · grow",
    category: "create",
    status: "core_beta",
    description:
      "A working surface for creators to organize content, publishing tools, media, and audience-facing workflows.",
    route: "/creator-dashboard",
    action: "Open Creator Studio",
    highlights: [
      { label: "Content library", route: "/content-library", note: "Manage creator assets" },
      { label: "Scheduler", route: "/content-scheduler", note: "Plan content" },
      { label: "Video tools", route: "/video-tools", note: "Video creation utilities" },
    ],
    searchTerms: ["creator", "content", "publish", "video", "media", "studio"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    eyebrow: "CRM · automation · operations",
    category: "work",
    status: "controlled_beta",
    description:
      "Group business tooling around actual workflows: customer management, automation, operations, analytics, and integrations.",
    route: "/enterprise-resources",
    action: "Open Enterprise",
    highlights: [
      { label: "CRM", route: "/c-r-m", note: "Customer-management surface" },
      { label: "Workflow automation", route: "/workflow-automation", note: "Operational automation" },
      { label: "Integrations", route: "/integrations", note: "Integration catalog" },
    ],
    searchTerms: ["enterprise", "crm", "business", "automation", "operations", "team"],
  },
  {
    id: "investor",
    name: "Investor",
    eyebrow: "Metrics · room · governance",
    category: "work",
    status: "controlled_beta",
    description:
      "Organize investor-facing information and internal metrics without presenting beta screens as investment, regulatory, or token-sale approval.",
    route: "/investor-portal",
    action: "Open Investor area",
    highlights: [
      { label: "Investor metrics", route: "/investor-metrics", note: "Investor-facing metrics surface" },
      { label: "Investor room", route: "/investor-room", note: "Investor information workspace" },
      { label: "Vesting schedule", route: "/vesting-schedule", note: "Vesting schedule interface" },
    ],
    searchTerms: ["investor", "metrics", "governance", "vesting", "funding"],
  },
  {
    id: "impact",
    name: "SkyHope & Impact",
    eyebrow: "Charity · evidence · impact",
    category: "impact",
    status: "controlled_beta",
    description:
      "Bring charity and impact tools together while keeping donation execution and external proof claims behind their real verification boundaries.",
    route: "/charity",
    action: "Open Impact",
    highlights: [
      { label: "Leaderboard", route: "/charity-leaderboard", note: "Community impact ranking surface" },
      { label: "Impact map", route: "/impact-map", note: "Impact visualization" },
      { label: "Impact metrics", route: "/impact-metrics", note: "Impact measurement surface" },
    ],
    searchTerms: ["hope", "charity", "impact", "community", "giving"],
  },
  {
    id: "trust-safety",
    name: "Trust, Safety & Accessibility",
    eyebrow: "Security · controls · inclusive UX",
    category: "work",
    status: "controlled_beta",
    description:
      "Put account safety, moderation, security controls, accessibility, and audit surfaces in one understandable operational area.",
    route: "/trust-safety-dashboard",
    action: "Open Trust & Safety",
    highlights: [
      { label: "Accessibility", route: "/accessibility-settings", note: "Accessibility preferences" },
      { label: "Audit log", route: "/audit-log", note: "Operational audit surface" },
      { label: "Two-factor setup", route: "/two-factor-setup", note: "Account security setup" },
    ],
    searchTerms: ["security", "safety", "moderation", "accessibility", "audit", "2fa"],
  },
  {
    id: "analytics",
    name: "Analytics",
    eyebrow: "Measure · understand · improve",
    category: "work",
    status: "preview",
    description:
      "A consolidated entry point for analytics and reporting surfaces. Data quality still depends on the underlying beta integrations feeding each view.",
    route: "/analytics-dashboard",
    action: "Open Analytics",
    highlights: [
      { label: "Activity tracking", route: "/activity-tracking", note: "Activity measurement" },
      { label: "Campaign analytics", route: "/campaign-analytics", note: "Campaign measurement" },
      { label: "Viewer metrics", route: "/viewer-metrics", note: "Audience metrics" },
    ],
    searchTerms: ["analytics", "metrics", "report", "dashboard", "insights", "data"],
  },
] as const;

export const betaExperienceStatusCopy: Record<
  BetaExperienceStatus,
  { label: string; detail: string }
> = {
  core_beta: {
    label: "Core beta",
    detail: "Primary experience available for invitation-only user testing.",
  },
  controlled_beta: {
    label: "Controlled beta",
    detail:
      "UI and test flows are available, but provider, financial, AI, or operational side effects remain constrained by verification gates.",
  },
  preview: {
    label: "Preview",
    detail: "Discoverable surface that is not yet promoted as a complete beta workflow.",
  },
};


export interface BetaRouteContext {
  area: BetaExperienceArea | null;
  parentRoute: string;
  parentLabel: string;
}

const betaAreaRouteHints: Readonly<Record<string, readonly string[]>> = {
  social: ["social", "feed", "friend", "community", "profile", "post", "comment", "reaction", "follow", "bookmark", "story", "timeline"],
  "chat-calls": ["message", "chat", "inbox", "conversation", "video call", "voice message", "direct message", "dm inbox"],
  gaming: ["game", "gaming", "arcade", "blackjack", "roulette", "poker", "multiplayer", "leaderboard", "tournament", "battle", "clan"],
  hopeai: ["hope ai", "a i ", "assistant", "agent", "prompt", "model", "llm", "vector", "embedding", "code studio", "workflow builder"],
  "wallet-web3": ["wallet", "web3", "crypto", "blockchain", "chain", "token", "nft", "staking", "mining", "defi", "dex", "swap", "bridge", "dao", "validator"],
  marketplace: ["marketplace", "shopping", "shop", "store", "product", "cart", "checkout", "order", "catalog", "wishlist", "vendor", "inventory", "commerce"],
  "school-language": ["school", "course", "classroom", "learning", "quiz", "assignment", "grade", "student", "education", "tutor", "skill"],
  live: ["live stream", "streaming", "broadcast", "livestream", "vod"],
  dating: ["dating", "match feed", "matchmaking", "match chat", "relationship"],
  global: ["translation", "translated", "global", "culture", "international", "language exchange", "language partner", "language selector"],
  creator: ["creator", "content", "publish", "media", "video editor", "video upload", "audio", "blog", "reel"],
  enterprise: ["enterprise", "crm", "business", "organization", "project", "task", "approval", "support", "contract", "invoice", "billing", "subscription", "workflow automation"],
  investor: ["investor", "vesting", "fundraising", "treasury", "equity"],
  impact: ["charity", "donation", "impact", "skyhope"],
  "trust-safety": ["trust", "safety", "security", "privacy", "audit", "moderation", "compliance", "accessibility", "two factor", "2fa", "permission", "consent", "identity", "auth", "secret"],
  analytics: ["analytics", "metric", "report", "tracking", "insight", "monitoring", "status", "health"],
};

function normalizeRouteSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findBetaExperienceAreaForRoute(
  route: string,
  label = ""
): BetaExperienceArea | null {
  const exact = betaExperienceAreas.find(
    area =>
      area.route === route ||
      area.highlights.some(highlight => highlight.route === route)
  );
  if (exact) return exact;

  const haystack = ` ${normalizeRouteSearchText(route)} ${normalizeRouteSearchText(label)} `;
  let best: { area: BetaExperienceArea; score: number } | null = null;

  for (const area of betaExperienceAreas) {
    const hints = betaAreaRouteHints[area.id] ?? [];
    let score = 0;

    for (const hint of hints) {
      const normalizedHint = normalizeRouteSearchText(hint);
      if (normalizedHint && haystack.includes(` ${normalizedHint} `)) {
        score += 3;
      }
    }

    for (const term of area.searchTerms) {
      const normalizedTerm = normalizeRouteSearchText(term);
      if (normalizedTerm.length >= 4 && haystack.includes(` ${normalizedTerm} `)) {
        score += 1;
      }
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { area, score };
    }
  }

  return best?.area ?? null;
}

export function resolveBetaRouteContext(
  route: string,
  label = ""
): BetaRouteContext {
  const area = findBetaExperienceAreaForRoute(route, label);
  return {
    area,
    parentRoute: area?.route ?? "/platform-map",
    parentLabel: area?.name ?? "Explore",
  };
}
