export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const ARCADE_SESSION_KEY = "sky4444.arcade.session.v1";
export const QUIZ_ATTEMPTS_KEY = "sky4444.school.quiz-attempts.v1";

export type ArcadeSession = Readonly<{
  credits: number;
  stake: number;
  seed: number;
  highLowStreak: number;
  restored: boolean;
}>;

const DEFAULT_ARCADE_SESSION: ArcadeSession = {
  credits: 1000,
  stake: 25,
  seed: 4444,
  highLowStreak: 0,
  restored: false,
};

function finiteNumber(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function integer(value: unknown, fallback: number, min: number, max: number): number {
  return Math.trunc(finiteNumber(value, fallback, min, max));
}

export function sanitizeArcadeSession(value: unknown): ArcadeSession {
  if (!value || typeof value !== "object" || Array.isArray(value)) return DEFAULT_ARCADE_SESSION;
  const source = value as Record<string, unknown>;
  return {
    credits: Number(finiteNumber(source.credits, 1000, 0, 100000).toFixed(2)),
    stake: Number(finiteNumber(source.stake, 25, 1, 1000).toFixed(2)),
    seed: integer(source.seed, 4444, 1, 2147483647),
    highLowStreak: integer(source.highLowStreak, 0, 0, 10000),
    restored: true,
  };
}

export function loadArcadeSession(storage: StorageLike | null): ArcadeSession {
  if (!storage) return DEFAULT_ARCADE_SESSION;
  try {
    const raw = storage.getItem(ARCADE_SESSION_KEY);
    if (!raw) return DEFAULT_ARCADE_SESSION;
    return sanitizeArcadeSession(JSON.parse(raw));
  } catch {
    return DEFAULT_ARCADE_SESSION;
  }
}

export function saveArcadeSession(
  storage: StorageLike | null,
  session: Pick<ArcadeSession, "credits" | "stake" | "seed" | "highLowStreak">
): boolean {
  if (!storage) return false;
  try {
    const safe = sanitizeArcadeSession(session);
    storage.setItem(
      ARCADE_SESSION_KEY,
      JSON.stringify({
        credits: safe.credits,
        stake: safe.stake,
        seed: safe.seed,
        highLowStreak: safe.highLowStreak,
      })
    );
    return true;
  } catch {
    return false;
  }
}

export type QuizAttempt = Readonly<{
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  score: number;
  passed: boolean;
  correctCount: number;
  questionCount: number;
  recordedAt: string;
}>;

function boundedText(value: unknown, fallback = "", max = 160): string {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

export function sanitizeQuizAttempt(value: unknown): QuizAttempt | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const lessonId = boundedText(source.lessonId, "", 120);
  const courseId = boundedText(source.courseId, "", 120);
  const lessonTitle = boundedText(source.lessonTitle, "", 160);
  const recordedAt = boundedText(source.recordedAt, "", 40);
  if (!lessonId || !courseId || !lessonTitle || !recordedAt || Number.isNaN(Date.parse(recordedAt))) return null;
  const questionCount = integer(source.questionCount, 0, 1, 500);
  const correctCount = integer(source.correctCount, 0, 0, questionCount);
  return {
    lessonId,
    courseId,
    lessonTitle,
    score: integer(source.score, 0, 0, 100),
    passed: source.passed === true,
    correctCount,
    questionCount,
    recordedAt,
  };
}

export function appendQuizAttempt(
  storage: StorageLike | null,
  attempt: QuizAttempt,
  maxAttempts = 20
): boolean {
  if (!storage) return false;
  const safe = sanitizeQuizAttempt(attempt);
  if (!safe) return false;

  try {
    const parsed = JSON.parse(storage.getItem(QUIZ_ATTEMPTS_KEY) ?? "[]");
    const prior = Array.isArray(parsed)
      ? parsed.map(sanitizeQuizAttempt).filter((item): item is QuizAttempt => item !== null)
      : [];
    const limit = integer(maxAttempts, 20, 1, 100);
    storage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify([safe, ...prior].slice(0, limit)));
    return true;
  } catch {
    try {
      storage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify([safe]));
      return true;
    } catch {
      return false;
    }
  }
}

export function buildQuizCompletionSummary(input: {
  lessonTitle: string;
  score: number;
  passed: boolean;
  recordedAt: string;
}): string {
  const title = boundedText(input.lessonTitle, "SkySchool lesson", 160);
  const score = integer(input.score, 0, 0, 100);
  const when = Number.isNaN(Date.parse(input.recordedAt))
    ? "recorded locally"
    : new Date(input.recordedAt).toISOString();
  return `SkySchool beta completion — ${title} — ${score}% — ${input.passed ? "passed" : "not passed"} — ${when}. Browser-local learning evidence; not an accredited credential.`;
}
