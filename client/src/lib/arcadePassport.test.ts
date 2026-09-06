import { describe, expect, it } from "vitest";
import {
  arcadeDayKey,
  arcadePassportBadges,
  arcadePassportLevel,
  dailyArcadeGame,
  emptyArcadePassport,
  normalizeArcadePassport,
  parseArcadePassport,
  recordArcadeRun,
  toggleArcadeFavorite,
} from "./arcadePassport";

const date = new Date("2026-09-05T12:00:00.000Z");

describe("arcade passport", () => {
  it("creates a deterministic daily game for a UTC date", () => {
    expect(arcadeDayKey(date)).toBe("2026-09-05");
    expect(dailyArcadeGame(date)).toBe(dailyArcadeGame(date));
    expect(
      dailyArcadeGame(date, ["sky-rush", "crypto-quiz"])
    ).toMatch(/sky-rush|crypto-quiz/);
  });

  it("records bounded device-local game progress and daily completion", () => {
    const start = emptyArcadePassport(date);
    const result = recordArcadeRun(start, {
      gameId: start.daily.gameId,
      score: 1234.8,
      sparks: 12.9,
      xp: 550.2,
      combo: 8.7,
      completedAt: date,
    });

    expect(result.totalPlays).toBe(1);
    expect(result.totalSparks).toBe(12);
    expect(result.totalXp).toBe(550);
    expect(result.daily.completed).toBe(true);
    expect(result.games[start.daily.gameId]).toMatchObject({
      plays: 1,
      bestScore: 1234,
      bestCombo: 8,
      totalSparks: 12,
      totalXp: 550,
    });
    expect(arcadePassportLevel(result)).toBe(2);
  });

  it("keeps best score/combo while accumulating totals", () => {
    const first = recordArcadeRun(emptyArcadePassport(date), {
      gameId: "sky-rush",
      score: 900,
      combo: 6,
      sparks: 4,
      xp: 200,
      completedAt: date,
    });
    const second = recordArcadeRun(first, {
      gameId: "sky-rush",
      score: 500,
      combo: 9,
      sparks: 5,
      xp: 300,
      completedAt: date,
    });

    expect(second.games["sky-rush"]).toMatchObject({
      plays: 2,
      bestScore: 900,
      bestCombo: 9,
      totalSparks: 9,
      totalXp: 500,
    });
  });

  it("toggles favorites without duplicates", () => {
    const start = emptyArcadePassport(date);
    const added = toggleArcadeFavorite(start, "sky-rush");
    expect(added.favorites).toEqual(["sky-rush"]);
    expect(toggleArcadeFavorite(added, "sky-rush").favorites).toEqual([]);
  });

  it("normalizes untrusted stored data and drops unknown game ids", () => {
    const result = normalizeArcadePassport(
      {
        totalPlays: -10,
        totalSparks: Number.POSITIVE_INFINITY,
        totalXp: 100,
        favorites: ["sky-rush", "fake-game", "sky-rush"],
        games: {
          "sky-rush": {
            plays: 3.9,
            bestScore: 50.2,
            bestCombo: 4.1,
            totalSparks: 9,
            totalXp: 10,
            lastPlayedAt: "2026-09-05T00:00:00.000Z",
          },
        },
        daily: {
          dayKey: "2020-01-01",
          gameId: "fake-game",
          completed: true,
        },
      },
      date
    );

    expect(result.totalPlays).toBe(0);
    expect(result.totalSparks).toBe(0);
    expect(result.favorites).toEqual(["sky-rush"]);
    expect(result.games["sky-rush"].plays).toBe(3);
    expect(result.daily.dayKey).toBe("2026-09-05");
    expect(result.daily.completed).toBe(false);
  });

  it("recovers from invalid JSON", () => {
    expect(parseArcadePassport("{nope", date).totalPlays).toBe(0);
  });

  it("derives badges from recorded progress without monetary semantics", () => {
    let passport = emptyArcadePassport(date);
    passport = recordArcadeRun(passport, {
      gameId: "sky-rush",
      score: 100,
      sparks: 60,
      xp: 250,
      completedAt: date,
    });
    passport = recordArcadeRun(passport, {
      gameId: "crypto-quiz",
      score: 7,
      sparks: 40,
      xp: 250,
      completedAt: date,
    });
    passport = recordArcadeRun(passport, {
      gameId: "block-builder",
      score: 8,
      sparks: 10,
      xp: 100,
      completedAt: date,
    });

    const unlocked = arcadePassportBadges(passport)
      .filter(badge => badge.unlocked)
      .map(badge => badge.id);

    expect(unlocked).toEqual(
      expect.arrayContaining(["first-run", "sampler", "study", "spark"])
    );
  });
});
