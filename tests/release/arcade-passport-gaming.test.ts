import fs from "node:fs";
import { describe, expect, it } from "vitest";

const gaming = fs.readFileSync("client/src/pages/Gaming.tsx", "utf8");
const questBoard = fs.readFileSync(
  "client/src/pages/GameFiQuestBoard.tsx",
  "utf8"
);
const blackjack = fs.readFileSync(
  "client/src/pages/GameBlackjack.tsx",
  "utf8"
);
const reflex = fs.readFileSync("client/src/pages/GameCrash.tsx", "utf8");
const pattern = fs.readFileSync("client/src/pages/GameSlots.tsx", "utf8");
const passport = fs.readFileSync(
  "client/src/lib/arcadePassport.ts",
  "utf8"
);

describe("Arcade Passport gaming loop", () => {
  it("uses real device-local progress instead of the unavailable GameFi stub", () => {
    expect(gaming).toMatch(/useArcadePassportSync/);
    expect(gaming).toMatch(/toggleFavorite/);
    expect(gaming).toMatch(/Play today's challenge/);
    expect(gaming).toMatch(/Open Quest Board/);
    expect(gaming).not.toMatch(/trpc\.gamefi/);
    expect(gaming).not.toMatch(/Tournament records/);
    expect(gaming).not.toMatch(/Leaderboard records/);

    expect(questBoard).toMatch(/useArcadePassportSync/);
    expect(questBoard).toMatch(/Device-local progression/);
    expect(questBoard).toMatch(/No wallet, payout, staking, token reward/);
    expect(questBoard).not.toMatch(/rewardToken/);
    expect(questBoard).not.toMatch(/Reward sent to your wallet/);
    expect(questBoard).not.toMatch(/SKY444 Earned/);
  });

  it("keeps Arcade Passport bounded and explicitly non-financial", () => {
    expect(passport).toMatch(/ARCADE_PASSPORT_STORAGE_KEY/);
    expect(passport).toMatch(/dailyArcadeGameIds/);
    expect(passport).toMatch(/10_000_000/);
    expect(passport).toMatch(/100_000/);
    expect(passport).toMatch(/1_000_000/);
    expect(passport).toMatch(/recordArcadeRunToStorage/);
    expect(passport).toMatch(/toggleArcadeFavoriteInStorage/);
  });

  it("replaces blackjack wagering with decision practice", () => {
    expect(blackjack).toMatch(/Blackjack Strategy Lab/);
    expect(blackjack).toMatch(/recommendedDecision/);
    expect(blackjack).toMatch(/decision accuracy/i);
    expect(blackjack).toMatch(/gameId: "blackjack-lab"/);
    expect(blackjack).toMatch(/No wagers · no balance · no payout/);

    expect(blackjack).not.toMatch(/setBalance/);
    expect(blackjack).not.toMatch(/betAmount/);
    expect(blackjack).not.toMatch(/winnings/);
    expect(blackjack).not.toMatch(/setBalance/);
    expect(blackjack).not.toMatch(/toast\.success\([^)]*Blackjack/);
    expect(blackjack).not.toMatch(/SKY444/);
  });

  it("replaces multiplier wagering with reflex scoring", () => {
    expect(reflex).toMatch(/Multiplier Reflex Lab/);
    expect(reflex).toMatch(/scoreLock/);
    expect(reflex).toMatch(/Target .*x/);
    expect(reflex).toMatch(/gameId: "crash-lab"/);
    expect(reflex).toMatch(/Score only · no wager · no cashout/);

    expect(reflex).not.toMatch(/setBalance/);
    expect(reflex).not.toMatch(/hasBet/);
    expect(reflex).not.toMatch(/setPlayers/);
    expect(reflex).not.toMatch(/CASH OUT/);
    expect(reflex).not.toMatch(/autoCashout/);
    expect(reflex).not.toMatch(/handleBet/);
    expect(reflex).not.toMatch(/SKY444/);
  });

  it("replaces slots betting and auto-spin with manual pattern recognition", () => {
    expect(pattern).toMatch(/Pattern Match Lab/);
    expect(pattern).toMatch(/createPatternRound/);
    expect(pattern).toMatch(/gameId: "pattern-lab"/);
    expect(pattern).toMatch(/Manual rounds · no auto-spin · no betting/);
    expect(pattern).toMatch(/Which row contains the triple/);

    expect(pattern).not.toMatch(/setBalance/);
    expect(pattern).not.toMatch(/autoSpin/);
    expect(pattern).not.toMatch(/Bet Amount/);
    expect(pattern).not.toMatch(/winAmount/);
    expect(pattern).not.toMatch(/checkWin/);
    expect(pattern).not.toMatch(/JACKPOT/);
    expect(pattern).not.toMatch(/SKY444/);
  });

  it("records the already-promoted skill games into the shared passport", () => {
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
