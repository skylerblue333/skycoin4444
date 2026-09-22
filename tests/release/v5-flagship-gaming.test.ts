import fs from "node:fs";
import { describe, expect, it } from "vitest";

const gaming = fs.readFileSync("client/src/pages/Gaming.tsx", "utf8");
const arcade = fs.readFileSync("client/src/pages/Arcade.tsx", "utf8");
const crash = fs.readFileSync("client/src/pages/GameCrash.tsx", "utf8");
const blackjack = fs.readFileSync("client/src/pages/GameBlackjack.tsx", "utf8");
const docs = fs.readFileSync("docs/gaming/FLAGSHIP_ARCADE_V1.md", "utf8");

describe("V5 flagship gaming rebuild", () => {
  it("promotes the requested focused lineup instead of the quantity catalog", () => {
    expect(gaming).toContain("Crash");
    expect(gaming).toContain("Plinko");
    expect(gaming).toContain("High-Low");
    expect(gaming).toContain("Blackjack");
    expect(gaming).toContain("Roulette");
    expect(gaming).toContain("Crypto Ops");
    expect(gaming).not.toContain("50 games visible");
    expect(gaming).not.toContain("GameSlots");
  });

  it("keeps the shared arcade focused on Plinko, High-Low, Roulette, and Crypto Ops", () => {
    expect(arcade).toContain('value="plinko"');
    expect(arcade).toContain('value="high-low"');
    expect(arcade).toContain('value="roulette"');
    expect(arcade).toContain('value="crypto"');
    expect(arcade).toContain("Hash Hunt");
    expect(arcade).toContain("Wallet Defense");
  });

  it("keeps wagering-like surfaces explicitly demo-only", () => {
    expect(crash).toMatch(/no cash or token value/i);
    expect(blackjack).toMatch(/No real-money wager/i);
    expect(docs).toMatch(/no monetary or token value/i);
    expect(docs).toMatch(/does not.*accept deposits/is);
    expect(docs).toMatch(/does not.*settle bets on a blockchain/is);
  });
});
