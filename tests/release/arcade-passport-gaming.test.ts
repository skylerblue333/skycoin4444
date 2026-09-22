import fs from "node:fs";
import { describe, expect, it } from "vitest";

const gaming = fs.readFileSync("client/src/pages/Gaming.tsx", "utf8");
const arcade = fs.readFileSync("client/src/pages/Arcade.tsx", "utf8");
const questBoard = fs.readFileSync(
  "client/src/pages/GameFiQuestBoard.tsx",
  "utf8"
);
const blackjack = fs.readFileSync(
  "client/src/pages/GameBlackjack.tsx",
  "utf8"
);
const crash = fs.readFileSync("client/src/pages/GameCrash.tsx", "utf8");
const passport = fs.readFileSync(
  "client/src/lib/arcadePassport.ts",
  "utf8"
);

describe("flagship gaming and legacy Arcade Passport boundary", () => {
  it("keeps the legacy device-local passport available without making it the flagship lobby", () => {
    expect(questBoard).toMatch(/useArcadePassportSync/);
    expect(questBoard).toMatch(/Device-local progression/);
    expect(questBoard).toMatch(/No wallet, payout, staking, token reward/);
    expect(questBoard).not.toMatch(/rewardToken/);
    expect(questBoard).not.toMatch(/Reward sent to your wallet/);
    expect(questBoard).not.toMatch(/SKY444 Earned/);

    expect(gaming).toMatch(/Fewer games/);
    expect(gaming).toMatch(/Five core games/);
    expect(gaming).toMatch(/Crypto Ops/);
    expect(gaming).not.toMatch(/Tournament records/);
    expect(gaming).not.toMatch(/Leaderboard records/);
  });

  it("keeps Arcade Passport storage bounded and explicitly non-financial", () => {
    expect(passport).toMatch(/ARCADE_PASSPORT_STORAGE_KEY/);
    expect(passport).toMatch(/dailyArcadeGameIds/);
    expect(passport).toMatch(/10_000_000/);
    expect(passport).toMatch(/100_000/);
    expect(passport).toMatch(/1_000_000/);
    expect(passport).toMatch(/recordArcadeRunToStorage/);
    expect(passport).toMatch(/toggleArcadeFavoriteInStorage/);
  });

  it("rebuilds blackjack as a playable local dealer table", () => {
    expect(blackjack).toMatch(/Blackjack table/);
    expect(blackjack).toMatch(/Hit/);
    expect(blackjack).toMatch(/Stand/);
    expect(blackjack).toMatch(/Double/);
    expect(blackjack).toMatch(/dealer stands on 17/i);
    expect(blackjack).toMatch(/No real-money wager/);
    expect(blackjack).toMatch(/Demo chips/);
    expect(blackjack).not.toMatch(/SKY444/);
  });

  it("rebuilds Crash as a bounded local demo-credit cash-out game", () => {
    expect(crash).toMatch(/Ride the curve/);
    expect(crash).toMatch(/autoCashout/);
    expect(crash).toMatch(/CASH OUT/);
    expect(crash).toMatch(/Demo credits/);
    expect(crash).toMatch(/No deposit, wallet, purchase, token reward, payout, or withdrawal/);
    expect(crash).not.toMatch(/SKY444/);
  });

  it("surfaces the new Plinko, High-Low, Roulette, and Crypto Ops floor", () => {
    expect(arcade).toMatch(/Plinko Lab/);
    expect(arcade).toMatch(/High-Low/);
    expect(arcade).toMatch(/Roulette/);
    expect(arcade).toMatch(/Hash Hunt/);
    expect(arcade).toMatch(/Wallet Defense/);
    expect(arcade).toMatch(/Demo credits reset locally and cannot be purchased, redeemed, transferred, or withdrawn/);
  });

  it("preserves recorder support on legacy compatibility game routes", () => {
    for (const file of [
      "client/src/pages/GameSkyRush.tsx",
      "client/src/pages/GameCryptoQuiz.tsx",
      "client/src/pages/GameTokenTap.tsx",
      "client/src/pages/GameBlockBuilder.tsx",
    ]) {
      const source = fs.readFileSync(file, "utf8");
      expect(source).toMatch(/useArcadeRunRecorder/);
      expect(source).toMatch(/recordRun\(\{/);
    }
  });
});
