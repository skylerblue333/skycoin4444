import fs from "node:fs";
import { describe, expect, it } from "vitest";

const gaming = fs.readFileSync("client/src/pages/Gaming.tsx", "utf8");
const arcade = fs.readFileSync("client/src/pages/Arcade.tsx", "utf8");
const crash = fs.readFileSync("client/src/pages/GameCrash.tsx", "utf8");
const blackjack = fs.readFileSync("client/src/pages/GameBlackjack.tsx", "utf8");
const shared = fs.readFileSync("client/src/features/gaming/components/ArcadeSurface.tsx", "utf8");
const engine = fs.readFileSync("client/src/lib/flagshipGameEngine.ts", "utf8");
const docs = fs.readFileSync("docs/gaming/FLAGSHIP_ARCADE_V1.md", "utf8");

describe("flagship gaming V2 release contract", () => {
  it("retires quantity-first positioning and promotes the five deeper flagship games", () => {
    expect(gaming).toContain("Fewer games.");
    expect(gaming).toContain("Five core games");
    for (const marker of ["Crash", "Plinko", "High-Low", "Blackjack", "Roulette", "Crypto Ops"]) {
      expect(gaming).toContain(marker);
    }
    expect(gaming).not.toContain("50 games visible");
  });

  it("uses a shared premium surface and animation stack", () => {
    expect(shared).toContain("GamingBackdrop");
    expect(shared).toContain("GameStage");
    expect(shared).toContain("DemoBankroll");
    expect(shared).toContain("StakeSelector");
    expect(shared).toContain("framer-motion");
    expect(gaming).toContain("motion.");
    expect(arcade).toContain("motion.circle");
    expect(crash).toContain("motion.");
    expect(blackjack).toContain("motion.");
  });

  it("gives Plinko and roulette richer deterministic visual contracts", () => {
    expect(engine).toContain("PLINKO_MULTIPLIERS_10");
    expect(engine).toContain("EUROPEAN_ROULETTE_ORDER");
    expect(engine).toContain("rouletteRotationFor");
    expect(engine).toContain("points:");
    expect(arcade).toContain("37-POCKET");
    expect(arcade).toContain("Recent drops");
    expect(arcade).toContain("Last spins");
  });

  it("keeps all wager-like experiences explicitly non-financial", () => {
    expect(gaming).toMatch(/Demo credits only/);
    expect(gaming).toMatch(/No deposits, withdrawals, wallet wagering, custody, or blockchain settlement/);
    expect(arcade).toMatch(/cannot be purchased, redeemed, transferred, or withdrawn/);
    expect(crash).toMatch(/No deposit, wallet, purchase, token reward, payout, or withdrawal/);
    expect(blackjack).toMatch(/No real-money wager/);
    expect(docs).toMatch(/no monetary or token value/i);
    expect(docs).toMatch(/does not:[\s\S]*accept deposits/is);
    expect(docs).toMatch(/does not:[\s\S]*settle bets on a blockchain/is);
  });

  it("documents permissive open-source foundations without claiming imported casino infrastructure", () => {
    expect(docs).toContain("Framer Motion");
    expect(docs).toContain("Radix UI");
    expect(docs).toContain("Lucide");
    expect(docs).toMatch(/No third-party casino server/);
  });
});
