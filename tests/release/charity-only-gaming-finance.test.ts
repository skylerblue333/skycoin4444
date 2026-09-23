import fs from "node:fs";
import { describe, expect, it } from "vitest";

const gaming = fs.readFileSync("client/src/pages/Gaming.tsx", "utf8");
const charity = fs.readFileSync("client/src/pages/GamingForCharity.tsx", "utf8");
const policy = fs.readFileSync("server/features/charity-gaming-finance/index.ts", "utf8");
const docs = fs.readFileSync("docs/gaming/FLAGSHIP_ARCADE_V1.md", "utf8");

describe("charity-only gaming finance release contract", () => {
  it("keeps the flagship floor demo-only while reserving future finance for charity", () => {
    expect(gaming).toMatch(/Demo credits only/);
    expect(gaming).toMatch(/CHARITY/);
    expect(gaming).toMatch(/only finance scope/);
    expect(gaming).toMatch(/future deposit, withdrawal, real-money wager, custody, token settlement, or redeemable crypto reward is restricted to the charity-only finance path/);
  });

  it("documents every real-value action as charity-only", () => {
    for (const marker of [
      "Deposits + withdrawals",
      "Real-money wagering",
      "Custody + token settlement",
      "Redeemable crypto rewards",
    ]) {
      expect(charity).toContain(marker);
    }
    expect(charity).toMatch(/Charity-only finance policy/);
    expect(charity).toMatch(/No live donations/);
  });

  it("requires verified beneficiary and provider gates", () => {
    expect(policy).toMatch(/beneficiaryVerified/);
    expect(policy).toMatch(/paymentProviderApproved/);
    expect(policy).toMatch(/legalReviewApproved/);
    expect(policy).toMatch(/regionAllowed/);
    expect(policy).toMatch(/ageGatePassed/);
    expect(policy).toMatch(/regulatedGamingProviderApproved/);
  });

  it("does not claim SKYCOIN4444 executes regulated financial activity", () => {
    expect(policy).toMatch(/executeExternally: true/);
    expect(policy).toMatch(/custodyBySkycoin4444: false/);
    expect(policy).toMatch(/blockchainBroadcastBySkycoin4444: false/);
    expect(docs).toMatch(/authorization\/planning only/i);
    expect(docs).toMatch(/does not execute a payment or wager/i);
  });
});
