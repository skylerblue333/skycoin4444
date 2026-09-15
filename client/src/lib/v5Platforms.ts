export type V5PlatformId =
  | "social"
  | "live"
  | "gaming"
  | "commerce"
  | "learning"
  | "hopeai"
  | "web3"
  | "dating"
  | "global"
  | "creator";

export type V5PlatformAction = {
  label: string;
  route: string;
};

export type V5Platform = {
  id: V5PlatformId;
  name: string;
  kicker: string;
  description: string;
  route: string;
  value: string;
  capabilities: readonly string[];
  quickActions: readonly V5PlatformAction[];
  truth: string;
};

export const v5Platforms: readonly V5Platform[] = [
  {
    id: "social",
    name: "Sky Social",
    kicker: "Community + messaging",
    description:
      "Move from a unified activity stream into richer social, community, and messaging surfaces without hunting through the route catalog.",
    route: "/activity-feed",
    value: "A single social front door for discovery, conversation, and community context.",
    capabilities: ["Activity feed", "Community spaces", "Unified messaging"],
    quickActions: [
      { label: "Open social feed", route: "/social-feed-v2" },
      { label: "Message center", route: "/unified-messaging" },
      { label: "Community hub", route: "/community-hub" },
    ],
    truth:
      "Demo/community data does not imply real-world users, traffic, moderation coverage, or network scale.",
  },
  {
    id: "live",
    name: "Sky Live",
    kicker: "Video + creator presence",
    description:
      "Bring live-oriented screens, video tools, clips, and creator workflows together as one coherent media product surface.",
    route: "/live",
    value: "A creator-first live media workspace that is easy to understand and navigate.",
    capabilities: ["Live workspace", "Video tools", "VOD + clips"],
    quickActions: [
      { label: "Streaming dashboard", route: "/streaming-dashboard" },
      { label: "Video chat", route: "/video-chat" },
      { label: "VOD archive", route: "/v-o-d-archive" },
    ],
    truth:
      "Public livestream ingest, distribution, audience, and monetization are not claimed unless a real provider path is verified.",
  },
  {
    id: "gaming",
    name: "Sky Gaming",
    kicker: "Arcade + progression",
    description:
      "Turn the existing game catalog into a clear entertainment destination with an arcade, competition, progression, and replay-oriented paths.",
    route: "/gaming",
    value: "Fast entry into play, competition, progression, and the wider gaming catalog.",
    capabilities: ["Game catalog", "Arcade", "Tournaments + progression"],
    quickActions: [
      { label: "Enter arcade", route: "/arcade" },
      { label: "Tournaments", route: "/tournaments" },
      { label: "Battle pass", route: "/battle-pass" },
    ],
    truth:
      "Games may use deterministic or local beta state; rewards are not a promise of cash value, gambling payout, or blockchain settlement.",
  },
  {
    id: "commerce",
    name: "Sky Market",
    kicker: "Shopping + seller flows",
    description:
      "Combine discovery, cart, wishlist, seller, and checkout-planning surfaces into a commerce experience that feels intentional instead of scattered.",
    route: "/beta-commerce",
    value: "A shopper journey with visible product discovery, intent, cart, and fulfillment planning.",
    capabilities: ["Storefront", "Wishlist + cart", "Checkout planning"],
    quickActions: [
      { label: "Browse Sky Store", route: "/sky-store" },
      { label: "Shopping cart", route: "/shopping-cart" },
      { label: "Wishlist", route: "/wishlist-management" },
    ],
    truth:
      "Payment processing and financial settlement remain simulation/planning boundaries until a verified payment provider is connected.",
  },
  {
    id: "learning",
    name: "Sky School",
    kicker: "Courses + progress",
    description:
      "Make authored learning content, courses, quizzes, and progress continuity feel like one focused education platform.",
    route: "/sky-school",
    value: "A clear learn-next loop instead of a loose collection of educational screens.",
    capabilities: ["Course catalog", "Lesson continuity", "Quizzes + progress"],
    quickActions: [
      { label: "Course catalog", route: "/course-catalog" },
      { label: "Student progress", route: "/student-progress" },
      { label: "Quiz builder", route: "/quiz-builder" },
    ],
    truth:
      "Learning progress is product state, not accreditation, certification, mastery, or a professional credential.",
  },
  {
    id: "hopeai",
    name: "HopeAI",
    kicker: "Planning + agent workflows",
    description:
      "Present the AI planner, assistant surfaces, agents, and workflow tools as one understandable intelligence workspace.",
    route: "/hope-a-i",
    value: "One place to turn an idea into a structured plan and navigate the supporting AI-oriented tools.",
    capabilities: ["Planning", "Assistant surfaces", "Agent + workflow tools"],
    quickActions: [
      { label: "AI assistant", route: "/a-i-assistant" },
      { label: "Agent builder", route: "/agent-builder" },
      { label: "Workflow builder", route: "/workflow-builder" },
    ],
    truth:
      "Provider-backed AI actions and unsupported external integrations are not represented as live when no verified provider is connected.",
  },
  {
    id: "web3",
    name: "Sky Web3",
    kicker: "Wallet + chain exploration",
    description:
      "Group wallet, chain, contract, and transaction-planning surfaces into a safer Web3 sandbox with visible execution boundaries.",
    route: "/beta-web3",
    value: "Explore Web3 concepts and transaction intent without pretending custody or chain execution exists.",
    capabilities: ["Wallet views", "Chain explorer", "Contract surfaces"],
    quickActions: [
      { label: "Wallet overview", route: "/wallet-overview" },
      { label: "Chain explorer", route: "/chain-explorer" },
      { label: "Smart contracts", route: "/smart-contracts" },
    ],
    truth:
      "Wallet custody, signing, transfers, and production-chain execution remain disabled unless separately verified.",
  },
  {
    id: "dating",
    name: "Sky Dating",
    kicker: "Discovery + conversation",
    description:
      "Unify profile setup, discovery, matches, and messages into a clear relationship-oriented product path.",
    route: "/dating-home",
    value: "A focused path from profile to discovery to conversation with fewer dead ends.",
    capabilities: ["Profiles", "Discovery", "Matches + messages"],
    quickActions: [
      { label: "Discover people", route: "/dating-discovery" },
      { label: "Matches", route: "/dating-matches" },
      { label: "Messages", route: "/dating-messages" },
    ],
    truth:
      "Unverified people, sellers, products, ratings, or inventory are never presented as verified real-world entities merely because a UI exists.",
  },
  {
    id: "global",
    name: "Sky Global",
    kicker: "Language + worldwide community",
    description:
      "Connect language-partner discovery, translated community surfaces, and video conversation into one global communication destination.",
    route: "/translation-enabled-community",
    value: "A cross-language community path that connects discovery, translation, and conversation.",
    capabilities: ["Language partners", "Translated feeds", "Video conversation"],
    quickActions: [
      { label: "Find language partners", route: "/language-partner-discovery" },
      { label: "Translated feed", route: "/translation-enabled-social-feed" },
      { label: "Video call", route: "/video-call" },
    ],
    truth:
      "Translation and communication surfaces do not imply guaranteed translation accuracy, identity verification, or provider-backed calling infrastructure.",
  },
  {
    id: "creator",
    name: "Sky Creator",
    kicker: "Publish + grow",
    description:
      "Bring creator analytics, media publishing, content libraries, and audience tools together as a usable creator operating system.",
    route: "/creator-dashboard",
    value: "A creator home for publishing, media management, and understanding available tools.",
    capabilities: ["Creator dashboard", "Content library", "Publishing + analytics"],
    quickActions: [
      { label: "Content library", route: "/content-library" },
      { label: "Upload video", route: "/video-upload" },
      { label: "Creator analytics", route: "/creator-analytics" },
    ],
    truth:
      "Analytics and audience surfaces are product demonstrations unless backed by verified account-owned production data.",
  },
] as const;

export function findV5Platform(id: V5PlatformId) {
  return v5Platforms.find(platform => platform.id === id) ?? v5Platforms[0];
}

export function filterV5Platforms(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return v5Platforms;
  return v5Platforms.filter(platform =>
    [
      platform.name,
      platform.kicker,
      platform.description,
      platform.value,
      ...platform.capabilities,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}
