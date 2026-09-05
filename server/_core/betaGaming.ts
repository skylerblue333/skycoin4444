export const BETA_GAME_SESSION_SIGNAL = "beta_game_session";

export const betaGameIds = [
  "sky-rush",
  "spark-tap",
  "crypto-quiz",
  "block-builder",
  "arcade-lab",
] as const;

export type BetaGameId = (typeof betaGameIds)[number];

export type BetaGameSession = Readonly<{
  runId: string;
  gameId: BetaGameId;
  mode: string;
  score: number;
  sparks: number;
  combo: number;
  durationMs: number;
}>;

export type BetaGameSessionRecord = BetaGameSession &
  Readonly<{
    id: string;
    createdAt: Date;
  }>;

export type BetaGamingAchievement = Readonly<{
  id:
    | "first_run"
    | "spark_25"
    | "combo_10"
    | "score_2500"
    | "explorer_3";
  title: string;
  detail: string;
  unlocked: boolean;
  progress: number;
  target: number;
}>;

function isGameId(value: unknown): value is BetaGameId {
  return (
    typeof value === "string" &&
    (betaGameIds as readonly string[]).includes(value)
  );
}

function boundedInteger(
  value: unknown,
  min: number,
  max: number
): number | null {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= min &&
    value <= max
  )
    ? value
    : null;
}

export function encodeBetaGameSession(
  session: BetaGameSession
): string {
  return JSON.stringify({
    v: 1,
    r: session.runId,
    g: session.gameId,
    m: session.mode,
    s: session.score,
    p: session.sparks,
    c: session.combo,
    d: session.durationMs,
  });
}

export function decodeBetaGameSession(
  metadata: string | null | undefined
): BetaGameSession | null {
  if (!metadata) return null;

  try {
    const value = JSON.parse(metadata) as Record<string, unknown>;
    if (
      value.v !== 1 ||
      typeof value.r !== "string" ||
      value.r.length < 1 ||
      value.r.length > 64 ||
      !isGameId(value.g) ||
      typeof value.m !== "string" ||
      value.m.length < 1 ||
      value.m.length > 32
    ) {
      return null;
    }

    const score = boundedInteger(value.s, 0, 10_000_000);
    const sparks = boundedInteger(value.p, 0, 1_000_000);
    const combo = boundedInteger(value.c, 0, 1_000_000);
    const durationMs = boundedInteger(value.d, 0, 3_600_000);
    if (
      score === null ||
      sparks === null ||
      combo === null ||
      durationMs === null
    ) {
      return null;
    }

    return Object.freeze({
      runId: value.r,
      gameId: value.g,
      mode: value.m,
      score,
      sparks,
      combo,
      durationMs,
    });
  } catch {
    return null;
  }
}

export function betaGameLabel(gameId: BetaGameId): string {
  switch (gameId) {
    case "sky-rush":
      return "Sky Rush";
    case "spark-tap":
      return "Spark Tap";
    case "crypto-quiz":
      return "Crypto Quiz";
    case "block-builder":
      return "Block Builder";
    case "arcade-lab":
      return "Arcade Lab";
  }
}

function utcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function utcDayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ) / 86_400_000
  );
}

export function dailyBetaGame(date: Date): BetaGameId {
  return betaGameIds[Math.abs(utcDayNumber(date)) % betaGameIds.length];
}

export function summarizeBetaGaming(
  sessions: readonly BetaGameSessionRecord[],
  now: Date = new Date()
) {
  const totalRuns = sessions.length;
  const totalSparks = sessions.reduce(
    (sum, session) => sum + session.sparks,
    0
  );
  const bestScore = sessions.reduce(
    (best, session) => Math.max(best, session.score),
    0
  );
  const bestCombo = sessions.reduce(
    (best, session) => Math.max(best, session.combo),
    0
  );
  const distinctGames = new Set(
    sessions.map(session => session.gameId)
  ).size;
  const dailyGameId = dailyBetaGame(now);
  const today = utcDayKey(now);
  const dailyCompleted = sessions.some(
    session =>
      session.gameId === dailyGameId &&
      session.score > 0 &&
      utcDayKey(session.createdAt) === today
  );

  const achievements: BetaGamingAchievement[] = [
    {
      id: "first_run",
      title: "First Flight",
      detail: "Save your first beta game run.",
      unlocked: totalRuns >= 1,
      progress: Math.min(totalRuns, 1),
      target: 1,
    },
    {
      id: "spark_25",
      title: "Spark Collector",
      detail: "Collect 25 saved game-only Sparks.",
      unlocked: totalSparks >= 25,
      progress: Math.min(totalSparks, 25),
      target: 25,
    },
    {
      id: "combo_10",
      title: "Combo Pilot",
      detail: "Save a run with a 10x combo.",
      unlocked: bestCombo >= 10,
      progress: Math.min(bestCombo, 10),
      target: 10,
    },
    {
      id: "score_2500",
      title: "Score Chaser",
      detail: "Save a run scoring at least 2,500 points.",
      unlocked: bestScore >= 2500,
      progress: Math.min(bestScore, 2500),
      target: 2500,
    },
    {
      id: "explorer_3",
      title: "Arcade Explorer",
      detail: "Save runs from three different games.",
      unlocked: distinctGames >= 3,
      progress: Math.min(distinctGames, 3),
      target: 3,
    },
  ];

  return Object.freeze({
    totalRuns,
    totalSparks,
    bestScore,
    bestCombo,
    distinctGames,
    unlockedAchievements: achievements.filter(item => item.unlocked).length,
    achievements: Object.freeze(achievements),
    dailyChallenge: Object.freeze({
      day: today,
      gameId: dailyGameId,
      gameLabel: betaGameLabel(dailyGameId),
      completed: dailyCompleted,
      requirement: "Save one non-zero score run in today's game.",
    }),
    scope:
      "Latest bounded saved beta game sessions for this authenticated account. Scores, Sparks, achievements, and challenge status have no monetary or token value.",
  });
}
