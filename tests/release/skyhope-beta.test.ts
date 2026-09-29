import fs from "node:fs";
import { describe, expect, it } from "vitest";

const page = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");
const router = fs.readFileSync("server/routers.ts", "utf8");
const charityRouter = fs.readFileSync("server/routers/charity.ts", "utf8");
const domain = fs.readFileSync("server/features/skyhope/index.ts", "utf8");
const navigation = fs.readFileSync("client/src/components/BetaNavigation.tsx", "utf8");
const scope = fs.readFileSync("BETA_SCOPE.md", "utf8");

describe("SkyHope controlled-beta release contract", () => {
  it("promotes SkyHope as a major navigation path", () => {
    expect(navigation).toContain('{ label: "SkyHope", route: "/charity"');
    expect(navigation).toMatch(/HopeAI, SkyHope/);
  });

  it("replaces the generic unimplemented charity router with bounded procedures", () => {
    expect(router).toContain('charity:router({ ...createUnavailableFeatureRecord("Charity"), ...charityProcedures })');
    expect(charityRouter).toContain("planPledge");
    expect(charityRouter).toContain("volunteer");
    expect(charityRouter).toContain("boundary");
  });

  it("keeps payment, persistence, blockchain and impact claims disabled", () => {
    for (const marker of [
      "executesPayments: false",
      "persistsDonations: false",
      "holdsCustody: false",
      "transfersTokens: false",
      "broadcastsBlockchainTransactions: false",
      "provesExternalImpact: false",
    ]) {
      expect(domain).toContain(marker);
    }
    expect(page).toMatch(/No payment was collected/);
    expect(page).toMatch(/does not collect money/);
  });

  it("removes the prior fabricated DAO and on-chain donation framing from the flagship charity page", () => {
    expect(page).not.toMatch(/DAO_PROPOSALS/);
    expect(page).not.toMatch(/SkylerDev|CryptoKing|NFTQueen/);
    expect(page).not.toMatch(/on-chain verified/i);
    expect(page).not.toMatch(/100% of donations/i);
  });

  it("documents SkyHope inside the governed beta scope", () => {
    expect(scope).toMatch(/SkyHope cause discovery and pledge planning/);
    expect(scope).toMatch(/non-settling pledge planner/);
    expect(scope).toMatch(/does not collect money/i);
  });
});
