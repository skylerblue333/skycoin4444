import { describe, expect, it } from "vitest";
import {
  ARCADE_SESSION_KEY,
  QUIZ_ATTEMPTS_KEY,
  appendQuizAttempt,
  buildQuizCompletionSummary,
  loadArcadeSession,
  saveArcadeSession,
  sanitizeArcadeSession,
} from "./betaSessionState";

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("beta session state", () => {
  it("fails closed on corrupt arcade browser state", () => {
    const storage = new MemoryStorage();
    storage.setItem(ARCADE_SESSION_KEY, "{not-json");
    expect(loadArcadeSession(storage)).toEqual({
      credits: 1000,
      stake: 25,
      seed: 4444,
      highLowStreak: 0,
      restored: false,
    });
  });

  it("bounds arcade values before persistence", () => {
    const storage = new MemoryStorage();
    expect(saveArcadeSession(storage, { credits: 9999999, stake: -50, seed: 0, highLowStreak: 999999 })).toBe(true);
    expect(loadArcadeSession(storage)).toEqual({
      credits: 100000,
      stake: 1,
      seed: 1,
      highLowStreak: 10000,
      restored: true,
    });
    expect(sanitizeArcadeSession({ credits: Number.NaN, stake: Infinity })).toMatchObject({
      credits: 1000,
      stake: 25,
    });
  });

  it("keeps quiz attempt history bounded and rejects fake credential language", () => {
    const storage = new MemoryStorage();
    for (let index = 0; index < 25; index += 1) {
      expect(appendQuizAttempt(storage, {
        lessonId: "lesson-" + index,
        courseId: "course",
        lessonTitle: "Safe Wallets",
        score: 80,
        passed: true,
        correctCount: 4,
        questionCount: 5,
        recordedAt: "2026-09-29T08:00:00.000Z",
      })).toBe(true);
    }
    const attempts = JSON.parse(storage.getItem(QUIZ_ATTEMPTS_KEY) ?? "[]");
    expect(attempts).toHaveLength(20);
    const summary = buildQuizCompletionSummary({
      lessonTitle: "Safe Wallets",
      score: 80,
      passed: true,
      recordedAt: "2026-09-29T08:00:00.000Z",
    });
    expect(summary).toContain("Browser-local learning evidence");
    expect(summary).toContain("not an accredited credential");
  });
});
