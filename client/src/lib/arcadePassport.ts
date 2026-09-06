export const ARCADE_PASSPORT_STORAGE_KEY =
  "skycoin4444.arcadePassport.v1";

export const arcadeGameIds = [
  "sky-rush",
  "crypto-quiz",
  "spark-tap",
  "block-builder",
  "arcade-lab",
  "blackjack-lab",
  "crash-lab",
  "pattern-lab",
] as const;

export type ArcadeGameId = (typeof arcadeGameIds)[number];

export const dailyArcadeGameIds = [
  "sky-rush",
  "crypto-quiz",
  "spark-tap",
  "block-builder",
  "blackjack-lab",
  "crash-lab",
  "pattern-lab",
] as const satisfies readonly ArcadeGameId[];

export type ArcadeGameProgress = Readonly<{
  plays: number;
  bestScore: number;
  bestCombo: number;
  totalSparks: number;
  totalXp: number;
  lastPlayedAt: string | null;
}>;

export type ArcadePassport = Readonly<{
  version: 1;
  totalPlays: number;
  totalSparks: number;
  totalXp: number;
  favorites: ArcadeGameId[];
  games: Record<ArcadeGameId, ArcadeGameProgress>;
  daily: Readonly<{
    dayKey: string;
    gameId: ArcadeGameId;
    completed: boolean;
  }>;
}>;

export type ArcadeRun = Readonly<{
  gameId: ArcadeGameId;
  score: number;
  sparks?: number;
  xp?: number;
  combo?: number;
  completedAt?: Date;
}>;

export type ArcadeProgressSyncRow = Readonly<{
  gameId: string;
  plays: number;
  bestScore: number;
  bestCombo: number;
  totalSparks: number;
  totalXp: number;
  lastPlayedAt: Date | string | null;
}>;

function emptyProgress(): ArcadeGameProgress {
  return Object.freeze({
    plays: 0,
    bestScore: 0,
    bestCombo: 0,
    totalSparks: 0,
    totalXp: 0,
    lastPlayedAt: null,
  });
}

function gameRecord(): Record<ArcadeGameId, ArcadeGameProgress> {
  return Object.fromEntries(
    arcadeGameIds.map(gameId => [gameId, emptyProgress()])
  ) as Record<ArcadeGameId, ArcadeGameProgress>;
}

export function arcadeDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function dailyArcadeGame(
  date = new Date(),
  pool: readonly ArcadeGameId[] = dailyArcadeGameIds
): ArcadeGameId {
  const usable = pool.length ? pool : arcadeGameIds;
  const dayNumber = Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      86_400_000
  );
  return usable[Math.abs(dayNumber) % usable.length] ?? "sky-rush";
}

export function emptyArcadePassport(date = new Date()): ArcadePassport {
  return Object.freeze({
    version: 1 as const,
    totalPlays: 0,
    totalSparks: 0,
    totalXp: 0,
    favorites: [],
    games: gameRecord(),
    daily: Object.freeze({
      dayKey: arcadeDayKey(date),
      gameId: dailyArcadeGame(date),
      completed: false,
    }),
  });
}

function finiteNonNegativeInteger(value: unknown): number {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
    ? Math.floor(value)
    : 0;
}

function validGameId(value: unknown): value is ArcadeGameId {
  return (
    typeof value === "string" &&
    (arcadeGameIds as readonly string[]).includes(value)
  );
}

export function normalizeArcadePassport(
  input: unknown,
  date = new Date()
): ArcadePassport {
  const empty = emptyArcadePassport(date);
  if (!input || typeof input !== "object") return empty;

  const source = input as Partial<ArcadePassport>;
  const sourceGames =
    source.games && typeof source.games === "object" ? source.games : {};
  const games = gameRecord();

  for (const gameId of arcadeGameIds) {
    const raw = (sourceGames as Partial<
      Record<ArcadeGameId, Partial<ArcadeGameProgress>>
    >)[gameId];
    if (!raw || typeof raw !== "object") continue;

    games[gameId] = Object.freeze({
      plays: finiteNonNegativeInteger(raw.plays),
      bestScore: finiteNonNegativeInteger(raw.bestScore),
      bestCombo: finiteNonNegativeInteger(raw.bestCombo),
      totalSparks: finiteNonNegativeInteger(raw.totalSparks),
      totalXp: finiteNonNegativeInteger(raw.totalXp),
      lastPlayedAt:
        typeof raw.lastPlayedAt === "string" ? raw.lastPlayedAt : null,
    });
  }

  const favorites = Array.isArray(source.favorites)
    ? Array.from(new Set(source.favorites.filter(validGameId))).slice(0, 8)
    : [];

  const currentDayKey = arcadeDayKey(date);
  const storedDaily =
    source.daily && typeof source.daily === "object" ? source.daily : null;
  const dailyGame =
    storedDaily?.dayKey === currentDayKey &&
    validGameId(storedDaily.gameId)
      ? storedDaily.gameId
      : dailyArcadeGame(date);

  return Object.freeze({
    version: 1 as const,
    totalPlays: finiteNonNegativeInteger(source.totalPlays),
    totalSparks: finiteNonNegativeInteger(source.totalSparks),
    totalXp: finiteNonNegativeInteger(source.totalXp),
    favorites,
    games,
    daily: Object.freeze({
      dayKey: currentDayKey,
      gameId: dailyGame,
      completed:
        storedDaily?.dayKey === currentDayKey &&
        storedDaily.completed === true,
    }),
  });
}

export function parseArcadePassport(
  raw: string | null,
  date = new Date()
): ArcadePassport {
  if (!raw) return emptyArcadePassport(date);
  try {
    return normalizeArcadePassport(JSON.parse(raw), date);
  } catch {
    return emptyArcadePassport(date);
  }
}

export function loadArcadePassport(
  storage: Pick<Storage, "getItem"> | null | undefined =
    typeof window !== "undefined" ? window.localStorage : undefined,
  date = new Date()
): ArcadePassport {
  if (!storage) return emptyArcadePassport(date);
  try {
    return parseArcadePassport(
      storage.getItem(ARCADE_PASSPORT_STORAGE_KEY),
      date
    );
  } catch {
    return emptyArcadePassport(date);
  }
}

export function saveArcadePassport(
  passport: ArcadePassport,
  storage: Pick<Storage, "setItem"> | null | undefined =
    typeof window !== "undefined" ? window.localStorage : undefined
): void {
  if (!storage) return;
  try {
    storage.setItem(ARCADE_PASSPORT_STORAGE_KEY, JSON.stringify(passport));
  } catch {
    // Device-local progression is best-effort and must never break gameplay.
  }
}

export function recordArcadeRunToStorage(
  run: ArcadeRun,
  storage:
    | Pick<Storage, "getItem" | "setItem">
    | null
    | undefined =
    typeof window !== "undefined" ? window.localStorage : undefined
): ArcadePassport {
  const current = loadArcadePassport(storage);
  const next = recordArcadeRun(current, run);
  saveArcadePassport(next, storage);
  return next;
}

export function toggleArcadeFavoriteInStorage(
  gameId: ArcadeGameId,
  storage:
    | Pick<Storage, "getItem" | "setItem">
    | null
    | undefined =
    typeof window !== "undefined" ? window.localStorage : undefined
): ArcadePassport {
  const current = loadArcadePassport(storage);
  const next = toggleArcadeFavorite(current, gameId);
  saveArcadePassport(next, storage);
  return next;
}

function clampRunValue(value: number | undefined, max: number): number {
  if (!Number.isFinite(value) || (value ?? 0) <= 0) return 0;
  return Math.min(max, Math.floor(value ?? 0));
}

export function normalizeArcadeRun(run: ArcadeRun): Required<
  Pick<ArcadeRun, "gameId" | "score" | "sparks" | "xp" | "combo">
> {
  return Object.freeze({
    gameId: run.gameId,
    score: clampRunValue(run.score, 10_000_000),
    sparks: clampRunValue(run.sparks, 100_000),
    xp: clampRunValue(run.xp, 1_000_000),
    combo: clampRunValue(run.combo, 100_000),
  });
}

export function recordArcadeRun(
  passport: ArcadePassport,
  run: ArcadeRun
): ArcadePassport {
  const current = normalizeArcadePassport(
    passport,
    run.completedAt ?? new Date()
  );
  const previous = current.games[run.gameId];
  const normalizedRun = normalizeArcadeRun(run);
  const score = normalizedRun.score;
  const sparks = normalizedRun.sparks;
  const xp = normalizedRun.xp;
  const combo = normalizedRun.combo;
  const completedAt = (run.completedAt ?? new Date()).toISOString();

  const games = {
    ...current.games,
    [run.gameId]: Object.freeze({
      plays: previous.plays + 1,
      bestScore: Math.max(previous.bestScore, score),
      bestCombo: Math.max(previous.bestCombo, combo),
      totalSparks: previous.totalSparks + sparks,
      totalXp: previous.totalXp + xp,
      lastPlayedAt: completedAt,
    }),
  };

  return Object.freeze({
    ...current,
    totalPlays: current.totalPlays + 1,
    totalSparks: current.totalSparks + sparks,
    totalXp: current.totalXp + xp,
    games,
    daily: Object.freeze({
      ...current.daily,
      completed:
        current.daily.completed || current.daily.gameId === run.gameId,
    }),
  });
}

export function toggleArcadeFavorite(
  passport: ArcadePassport,
  gameId: ArcadeGameId
): ArcadePassport {
  const current = normalizeArcadePassport(passport);
  const favorites = current.favorites.includes(gameId)
    ? current.favorites.filter(item => item !== gameId)
    : [...current.favorites, gameId].slice(-8);

  return Object.freeze({
    ...current,
    favorites,
  });
}

function normalizeSyncDate(value: Date | string | null): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

export function mergeArcadeProgress(
  passport: ArcadePassport,
  rows: readonly ArcadeProgressSyncRow[],
  date = new Date()
): ArcadePassport {
  const current = normalizeArcadePassport(passport, date);
  const games = { ...current.games };

  for (const row of rows) {
    if (!validGameId(row.gameId)) continue;
    const previous = games[row.gameId];
    const serverPlayedAt = normalizeSyncDate(row.lastPlayedAt);
    const previousPlayedAt = normalizeSyncDate(previous.lastPlayedAt);
    const latestPlayedAt =
      serverPlayedAt &&
      (!previousPlayedAt || serverPlayedAt > previousPlayedAt)
        ? serverPlayedAt
        : previousPlayedAt;

    games[row.gameId] = Object.freeze({
      plays: Math.max(previous.plays, finiteNonNegativeInteger(row.plays)),
      bestScore: Math.max(
        previous.bestScore,
        finiteNonNegativeInteger(row.bestScore)
      ),
      bestCombo: Math.max(
        previous.bestCombo,
        finiteNonNegativeInteger(row.bestCombo)
      ),
      totalSparks: Math.max(
        previous.totalSparks,
        finiteNonNegativeInteger(row.totalSparks)
      ),
      totalXp: Math.max(
        previous.totalXp,
        finiteNonNegativeInteger(row.totalXp)
      ),
      lastPlayedAt: latestPlayedAt,
    });
  }

  const totalPlays = arcadeGameIds.reduce(
    (sum, gameId) => sum + games[gameId].plays,
    0
  );
  const totalSparks = arcadeGameIds.reduce(
    (sum, gameId) => sum + games[gameId].totalSparks,
    0
  );
  const totalXp = arcadeGameIds.reduce(
    (sum, gameId) => sum + games[gameId].totalXp,
    0
  );
  const dailyPlayedAt = games[current.daily.gameId].lastPlayedAt;
  const serverClearedDaily =
    typeof dailyPlayedAt === "string" &&
    dailyPlayedAt.slice(0, 10) === current.daily.dayKey;

  return Object.freeze({
    ...current,
    totalPlays,
    totalSparks,
    totalXp,
    games,
    daily: Object.freeze({
      ...current.daily,
      completed: current.daily.completed || serverClearedDaily,
    }),
  });
}

export type ArcadePassportBadge = Readonly<{
  id: string;
  label: string;
  detail: string;
  unlocked: boolean;
}>;

export function arcadePassportBadges(
  passport: ArcadePassport
): ArcadePassportBadge[] {
  const uniqueGames = arcadeGameIds.filter(
    gameId => passport.games[gameId].plays > 0
  ).length;

  return [
    {
      id: "first-run",
      label: "First Run",
      detail: "Finish one recorded arcade session.",
      unlocked: passport.totalPlays >= 1,
    },
    {
      id: "sampler",
      label: "Arcade Sampler",
      detail: "Finish a run in three different game modes.",
      unlocked: uniqueGames >= 3,
    },
    {
      id: "daily",
      label: "Daily Clear",
      detail: "Complete today's deterministic daily game.",
      unlocked: passport.daily.completed,
    },
    {
      id: "study",
      label: "Study Loop",
      detail: "Earn at least 500 device-local Study XP.",
      unlocked: passport.totalXp >= 500,
    },
    {
      id: "spark",
      label: "Spark Collector",
      detail: "Collect at least 100 device-local Sparks.",
      unlocked: passport.totalSparks >= 100,
    },
  ];
}

export function arcadePassportLevel(passport: ArcadePassport): number {
  return 1 + Math.floor(passport.totalXp / 500);
}
