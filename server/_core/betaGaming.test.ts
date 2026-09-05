import { describe, expect, it } from "vitest";
import {
  betaGameLabel,
  dailyBetaGame,
  decodeBetaGameSession,
  encodeBetaGameSession,
  summarizeBetaGaming,
  type BetaGameSessionRecord,
} from "./betaGaming";

function record(
  overrides: Partial<BetaGameSessionRecord> = {}
): BetaGameSessionRecord {
  return {
    id: "game-1",
    runId: "11111111-1111-4111-8111-111111111111",
    gameId: "sky-rush",
    mode: "rush",
    score: 1200,
    sparks: 12,
    combo: 7,
    durationMs: 45000,
    createdAt: new Date("2026-09-05T12:00:00Z"),
    ...overrides,
  };
}

describe("beta gaming domain", () => {
  it("round-trips bounded session metadata", () => {
    const session = record();
    const encoded = encodeBetaGameSession(session);

    expect(encoded.length).toBeLessThanOrEqual(255);
    expect(decodeBetaGameSession(encoded)).toEqual({
      runId: session.runId,
      gameId: session.gameId,
      mode: session.mode,
      score: session.score,
      sparks: session.sparks,
      combo: session.combo,
      durationMs: session.durationMs,
    });
  });

  it("rejects malformed or out-of-range stored metadata", () => {
    expect(decodeBetaGameSession(null)).toBeNull();
    expect(decodeBetaGameSession("{not-json")).toBeNull();
    expect(
      decodeBetaGameSession(
        JSON.stringify({
          v: 1,
          r: "run",
          g: "sky-rush",
          m: "rush",
          s: -1,
          p: 0,
          c: 0,
          d: 0,
        })
      )
    ).toBeNull();
  });

  it("derives account-only achievements from saved sessions", () => {
    const sessions = [
      record({
        score: 3000,
        sparks: 30,
        combo: 12,
      }),
      record({
        id: "game-2",
        gameId: "crypto-quiz",
        score: 800,
        sparks: 8,
        combo: 3,
      }),
      record({
        id: "game-3",
        gameId: "spark-tap",
        score: 600,
        sparks: 10,
        combo: 5,
      }),
    ];

    const summary = summarizeBetaGaming(
      sessions,
      new Date("2026-09-05T18:00:00Z")
    );

    expect(summary.totalRuns).toBe(3);
    expect(summary.totalSparks).toBe(48);
    expect(summary.bestScore).toBe(3000);
    expect(summary.bestCombo).toBe(12);
    expect(summary.distinctGames).toBe(3);
    expect(summary.unlockedAchievements).toBe(5);
    expect(summary.scope).toMatch(/no monetary or token value/);
  });

  it("uses a deterministic UTC daily challenge", () => {
    const date = new Date("2026-09-05T12:00:00Z");
    const first = dailyBetaGame(date);
    const second = dailyBetaGame(date);

    expect(first).toBe(second);
    expect(betaGameLabel(first).length).toBeGreaterThan(0);

    const summary = summarizeBetaGaming(
      [
        record({
          gameId: first,
          createdAt: new Date("2026-09-05T15:00:00Z"),
        }),
      ],
      date
    );
    expect(summary.dailyChallenge.completed).toBe(true);
  });

  it("does not count a different-day run toward today's challenge", () => {
    const now = new Date("2026-09-05T12:00:00Z");
    const summary = summarizeBetaGaming(
      [
        record({
          gameId: dailyBetaGame(now),
          createdAt: new Date("2026-09-04T23:59:59Z"),
        }),
      ],
      now
    );

    expect(summary.dailyChallenge.completed).toBe(false);
  });
});
