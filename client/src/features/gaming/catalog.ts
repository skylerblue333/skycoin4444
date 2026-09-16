import type { ArcadeGameId } from "@/lib/arcadePassport";

export type GamingCategory =
  | "all"
  | "favorites"
  | "arcade"
  | "knowledge"
  | "strategy"
  | "simulation";

export type CoreGameDefinition = Readonly<{
  id: ArcadeGameId;
  name: string;
  detail: string;
  href: string;
  category: Exclude<GamingCategory, "all" | "favorites">;
  duration: string;
  tag: string;
  art: string;
}>;

export type ArcadeModeDefinition = Readonly<{
  name: string;
  detail: string;
  category: "arcade" | "knowledge" | "strategy";
  mode: string;
}>;

export const coreGames: readonly CoreGameDefinition[] = [
  {
    id: "sky-rush",
    name: "Sky Rush",
    detail: "Three-lane reflex runner with escalating speed, shields, combos, and no-value Sparks.",
    href: "/game-sky-rush",
    category: "arcade",
    duration: "3–6 min",
    tag: "FLAGSHIP",
    art: "from-violet-500 via-fuchsia-600 to-indigo-950",
  },
  {
    id: "crypto-quiz",
    name: "Crypto Quiz Blitz",
    detail: "Fast blockchain recall with Study XP and no token payout or financial reward.",
    href: "/game-crypto-quiz",
    category: "knowledge",
    duration: "~4 min",
    tag: "LEARN + PLAY",
    art: "from-cyan-500 via-blue-700 to-indigo-950",
  },
  {
    id: "spark-tap",
    name: "Spark Tap",
    detail: "Thirty-second speed/combo challenge with device-local Sparks and XP only.",
    href: "/game-token-tap",
    category: "arcade",
    duration: "30 sec",
    tag: "QUICK PLAY",
    art: "from-emerald-500 via-teal-700 to-slate-950",
  },
  {
    id: "block-builder",
    name: "Block Builder",
    detail: "Timing/stacking puzzle with local scores, perfect-drop chains, and no-value Sparks.",
    href: "/game-block-builder",
    category: "strategy",
    duration: "Short run",
    tag: "PUZZLE",
    art: "from-amber-500 via-orange-700 to-rose-950",
  },
  {
    id: "arcade-lab",
    name: "Arcade Lab",
    detail: "A deterministic mini-game library with memory, word, logic, board, snake, and puzzle modes.",
    href: "/arcade",
    category: "arcade",
    duration: "Pick a mode",
    tag: "13 MODES",
    art: "from-sky-500 via-blue-700 to-indigo-950",
  },
  {
    id: "blackjack-lab",
    name: "Blackjack Strategy Lab",
    detail: "Card-decision practice scored for strategy quality only—no chips, wagers, payouts, or balance.",
    href: "/game-blackjack",
    category: "simulation",
    duration: "Practice",
    tag: "SKILL LAB",
    art: "from-emerald-600 via-green-900 to-black",
  },
  {
    id: "crash-lab",
    name: "Multiplier Reflex Lab",
    detail: "Timing/reflex practice against a deterministic rising curve with score only and no cashout value.",
    href: "/game-crash",
    category: "simulation",
    duration: "Practice",
    tag: "REFLEX LAB",
    art: "from-fuchsia-600 via-violet-900 to-black",
  },
  {
    id: "pattern-lab",
    name: "Pattern Match Lab",
    detail: "Short reel-pattern recognition rounds scored for matches—no betting, balance, RTP, or payout.",
    href: "/game-slots",
    category: "simulation",
    duration: "Short rounds",
    tag: "PATTERN LAB",
    art: "from-yellow-500 via-orange-700 to-red-950",
  },
];

export const arcadeModes: readonly ArcadeModeDefinition[] = [
  { name: "High-Low", detail: "Predict the deterministic next card.", category: "arcade", mode: "high-low" },
  { name: "Memory Match", detail: "Match symbol pairs under a bounded board.", category: "arcade", mode: "memory" },
  { name: "Word Chain", detail: "Build a valid chain one word at a time.", category: "knowledge", mode: "word" },
  { name: "Crypto Trivia", detail: "Recall practical security and blockchain concepts.", category: "knowledge", mode: "trivia" },
  { name: "Tower Stack", detail: "Place blocks with precision and recover from misses.", category: "strategy", mode: "tower" },
  { name: "Mines Logic", detail: "Read a deterministic grid without wagering.", category: "strategy", mode: "mines" },
  { name: "Chess Geometry", detail: "Practice legal piece movement geometry.", category: "strategy", mode: "chess" },
  { name: "Checkers Steps", detail: "Validate bounded diagonal movement.", category: "strategy", mode: "checkers" },
  { name: "Reaction Sprint", detail: "Tap after the signal and measure your run.", category: "arcade", mode: "reaction" },
  { name: "Signal Sort", detail: "Classify a message by signal before reacting.", category: "knowledge", mode: "signal-sort" },
  { name: "Privacy Triage", detail: "Choose the safest response to a data request.", category: "knowledge", mode: "privacy-triage" },
  { name: "Threat Model", detail: "Identify the highest-risk security boundary.", category: "strategy", mode: "threat-model" },
  { name: "Budget Builder", detail: "Start a responsible budget from real constraints.", category: "strategy", mode: "budget-builder" },
  { name: "Source Check", detail: "Select the strongest evidence for a product claim.", category: "knowledge", mode: "source-check" },
  { name: "Consent Compass", detail: "Practice responsible media-sharing decisions.", category: "knowledge", mode: "consent-compass" },
  { name: "Debug Ladder", detail: "Choose the first useful move on a bug report.", category: "strategy", mode: "debug-ladder" },
  { name: "API Contract", detail: "Handle unknown fields without unsafe assumptions.", category: "strategy", mode: "api-contract" },
  { name: "Inbox Zero", detail: "Prioritize a crowded queue with clear rules.", category: "strategy", mode: "inbox-zero" },
  { name: "Meeting Maker", detail: "Build the artifact that makes a meeting useful.", category: "strategy", mode: "meeting-maker" },
  { name: "Feedback Loop", detail: "Turn vague feedback into an actionable report.", category: "knowledge", mode: "feedback-loop" },
  { name: "Risk Register", detail: "Capture risk, trigger, owner, and mitigation.", category: "strategy", mode: "risk-register" },
  { name: "Test Case", detail: "Find the boundary states a feature must survive.", category: "strategy", mode: "test-case" },
  { name: "Data Minimizer", detail: "Choose privacy-preserving collection rules.", category: "knowledge", mode: "data-minimizer" },
  { name: "Source of Truth", detail: "Select the verified system behind a catalog claim.", category: "strategy", mode: "source-of-truth" },
  { name: "Queue Logic", detail: "Prevent duplicate processing with idempotency.", category: "strategy", mode: "queue-logic" },
  { name: "Cache Sense", detail: "Decide what needs freshness over speed.", category: "strategy", mode: "cache-sense" },
  { name: "Release Gate", detail: "Choose evidence for a safe promotion.", category: "strategy", mode: "release-gate" },
  { name: "UX Focus", detail: "Design a useful empty state and next action.", category: "knowledge", mode: "ux-focus" },
  { name: "Error Copy", detail: "Write recovery-oriented error guidance.", category: "knowledge", mode: "error-copy" },
  { name: "Search Craft", detail: "Bound and escape user search input.", category: "strategy", mode: "search-craft" },
  { name: "Auth Boundary", detail: "Place authorization where it cannot be bypassed.", category: "strategy", mode: "auth-boundary" },
  { name: "Wallet Sense", detail: "Protect recovery material from social engineering.", category: "knowledge", mode: "wallet-sense" },
  { name: "Marketplace Trust", detail: "Evaluate seller evidence without hype.", category: "knowledge", mode: "marketplace-trust" },
  { name: "Live Safety", detail: "Make honest claims about a small-room stream.", category: "knowledge", mode: "live-safety" },
  { name: "Learning Design", detail: "Choose an assessment that proves understanding.", category: "knowledge", mode: "learning-design" },
  { name: "Match Quality", detail: "Practice consent-first matching decisions.", category: "knowledge", mode: "match-quality" },
  { name: "Team Handoff", detail: "Package context and acceptance criteria clearly.", category: "strategy", mode: "team-handoff" },
  { name: "Incident First Aid", detail: "Isolate safely while preserving evidence.", category: "strategy", mode: "incident-first-aid" },
  { name: "Decision Matrix", detail: "Compare options by criteria and tradeoffs.", category: "strategy", mode: "decision-matrix" },
  { name: "Accessibility Check", detail: "Select inclusive keyboard and reader paths.", category: "knowledge", mode: "accessibility-check" },
  { name: "Sustainable Pace", detail: "Choose a reliable, verifiable delivery habit.", category: "strategy", mode: "sustainable-pace" },
  { name: "Product Truth", detail: "Label an unconnected integration honestly.", category: "knowledge", mode: "product-truth" },
];

export const directArcadeModes = new Set([
  "high-low",
  "memory",
  "word",
  "trivia",
  "tower",
  "mines",
  "chess",
  "checkers",
  "reaction",
]);

export const gamingFilters: ReadonlyArray<{ id: GamingCategory; label: string }> = [
  { id: "all", label: "Discover" },
  { id: "favorites", label: "Favorites" },
  { id: "arcade", label: "Arcade" },
  { id: "knowledge", label: "Learn + play" },
  { id: "strategy", label: "Strategy" },
  { id: "simulation", label: "Skill labs" },
];

export const gamingCatalogSize = coreGames.length + arcadeModes.length;

export function arcadeModeHref(mode: string): string {
  return `/arcade#${directArcadeModes.has(mode) ? mode : `skills-${mode}`}`;
}

export function matchesGamingQuery(
  item: Pick<ArcadeModeDefinition, "name" | "detail" | "category">,
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return `${item.name} ${item.detail} ${item.category}`.toLowerCase().includes(normalized);
}
