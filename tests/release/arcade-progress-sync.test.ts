import fs from "node:fs";
import { describe, expect, it } from "vitest";

const schema = fs.readFileSync("drizzle/schema.ts", "utf8");
const migration = fs.readFileSync(
  "drizzle/migrations/0013_arcade_game_progress.sql",
  "utf8"
);
const runner = fs.readFileSync(
  "scripts/migrate-arcade-progress.mjs",
  "utf8"
);
const router = fs.readFileSync(
  "server/routers/arcadeProgress.ts",
  "utf8"
);
const root = fs.readFileSync("server/routers.ts", "utf8");
const hook = fs.readFileSync(
  "client/src/hooks/useArcadePassportSync.ts",
  "utf8"
);
const gaming = fs.readFileSync("client/src/pages/Gaming.tsx", "utf8");
const arcade = fs.readFileSync("client/src/pages/Arcade.tsx", "utf8");
const quest = fs.readFileSync(
  "client/src/pages/GameFiQuestBoard.tsx",
  "utf8"
);

describe("arcade progress compatibility after flagship gaming rebuild", () => {
  it("uses one additive account-owned table with no financial fields", () => {
    expect(schema).toMatch(/arcadeGameProgress = mysqlTable\("arcade_game_progress"/);
    expect(schema).toMatch(/userGameUnique: uniqueIndex/);
    expect(schema).toMatch(/bestScore: int\("best_score"\)/);
    expect(schema).toMatch(/totalXp: int\("total_xp"\)/);
    expect(schema).not.toMatch(/arcadeGameProgress[\s\S]{0,1400}(balance|payout|wager|wallet|tokenAmount)/i);

    expect(migration).toMatch(/CREATE TABLE IF NOT EXISTS `arcade_game_progress`/);
    expect(migration).not.toMatch(/\bDROP\b|\bTRUNCATE\b|\bDELETE\b|\bUPDATE\b/i);
  });

  it("requires an explicit production migration confirmation and verifies schema", () => {
    expect(runner).toMatch(/ARCADE_PROGRESS_V1/);
    expect(runner).toMatch(/BETA_DB_MIGRATION_CONFIRM/);
    expect(runner).toMatch(/refuses localhost/i);
    expect(runner).toMatch(/SHOW COLUMNS FROM arcade_game_progress/);
    expect(runner).toMatch(/SHOW INDEX FROM arcade_game_progress/);
    expect(runner).toMatch(/information_schema\.KEY_COLUMN_USAGE/);
    expect(runner).toMatch(/REFERENCED_TABLE_NAME = 'users'/);
    expect(runner).not.toMatch(/DROP TABLE|TRUNCATE TABLE|DELETE FROM|UPDATE /i);
  });

  it("keeps the sync API protected, bounded, and non-authoritative", () => {
    expect(root).toMatch(/arcadeProgress:arcadeProgressRouter/);
    expect(router).toMatch(/protectedProcedure/);
    expect(router).toMatch(/10_000_000/);
    expect(router).toMatch(/100_000/);
    expect(router).toMatch(/1_000_000/);
    expect(router).toMatch(/authoritativeLeaderboard: false/);
    expect(router).toMatch(/financialValue: false/);
    expect(router).toMatch(/ER_NO_SUCH_TABLE/);
    expect(router).toMatch(/SERVICE_UNAVAILABLE/);
    expect(router).toMatch(/local game progress is still available/);
    expect(router).not.toMatch(/publicProcedure/);
  });

  it("keeps authenticated passport sync available on the compatibility quest surface", () => {
    expect(hook).toMatch(/recordArcadeRunToStorage/);
    expect(hook).toMatch(/if \(isAuthenticated\)/);
    expect(hook).toMatch(/mutation\.mutate\(\{[\s\S]*\.\.\.normalized[\s\S]*gameId: run\.gameId/);
    expect(hook).toMatch(/mergeArcadeProgress/);
    expect(quest).toMatch(/anti-cheat\s+ranking, or public leaderboard/);
    expect(gaming).toMatch(/flagship Games Center/i);
  });

  it("keeps the new flagship wager-like state browser-local and non-authoritative", () => {
    expect(gaming).toMatch(/browser-local demo game state/);
    expect(gaming).toMatch(/no cash or token value/i);
    expect(arcade).toMatch(/Demo credits reset locally/);
    expect(arcade).toMatch(/cannot be purchased, redeemed, transferred, or withdrawn/);
    expect(arcade).not.toMatch(/authoritativeLeaderboard/);
  });

  it("preserves shared recorder wiring on legacy compatibility games", () => {
    for (const file of [
      "client/src/pages/GameSkyRush.tsx",
      "client/src/pages/GameCryptoQuiz.tsx",
      "client/src/pages/GameTokenTap.tsx",
      "client/src/pages/GameBlockBuilder.tsx",
      "client/src/pages/GameSlots.tsx",
    ]) {
      const source = fs.readFileSync(file, "utf8");
      expect(source).toMatch(/useArcadeRunRecorder/);
      expect(source).toMatch(/recordRun\(\{/);
    }
  });
});
