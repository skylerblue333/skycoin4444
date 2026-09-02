import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync("client/src/pages/BetaWeb3Sandbox.tsx", "utf8");
const inventory = JSON.parse(fs.readFileSync("catalogs/screen-inventory.json", "utf8")) as {
  launchableBetaRoutes: string[];
};

describe("Web3 evidence room safety boundary", () => {
  it("promotes only the bounded evidence route", () => {
    expect(inventory.launchableBetaRoutes).toContain("/beta-web3");
    expect(source).toMatch(/Read-only \/ local-testnet boundary/);
    expect(source).toMatch(/Deterministic snapshot/);
    expect(source).toMatch(/Token metadata registry/);
  });

  it("keeps high-risk wallet and chain actions unavailable", () => {
    expect(source).toMatch(/does not connect wallets/);
    expect(source).toMatch(/request signatures/);
    expect(source).toMatch(/No token transfer, custody, or settlement/);
    expect(source).toMatch(/No mainnet provider or production protocol write/);
    expect(source).toMatch(/Wallet actions unavailable/);
    expect(source).not.toMatch(/connectWallet\s*\(/);
    expect(source).not.toMatch(/signTransaction\s*\(/);
    expect(source).not.toMatch(/sendTransaction\s*\(/);
  });
});
