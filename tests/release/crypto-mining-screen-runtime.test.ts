import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const mining = readFileSync("client/src/pages/MiningDashboard.tsx", "utf8");
const crypto = readFileSync("client/src/components/CryptoEngineeringLab.tsx", "utf8");
const server = readFileSync("server/_core/index.ts", "utf8");
const trumpMining = readFileSync("client/src/pages/TrumpMining.tsx", "utf8");
const docs = readFileSync("docs/OPEN_SOURCE_CRYPTO_RUNTIME.md", "utf8");

describe("working mining and crypto screens", () => {
  it("replaces fabricated mining economics with measured server-side hashing", () => {
    expect(mining).toContain("/api/crypto-lab/mining/benchmark");
    expect(mining).toContain("Real SHA-256 work");
    expect(mining).toContain("not a coin faucet");
    expect(mining).not.toContain("Math.random()");
    expect(mining).not.toContain("TRUMP_PRICE_MOCK");
    expect(mining).not.toContain("USD Value");
    expect(trumpMining).toContain('from "./MiningDashboard"');
  });

  it("connects crypto screens to node probes, transfer planning, and block construction", () => {
    expect(crypto).toContain("/api/crypto-lab/networks");
    expect(crypto).toContain("/api/crypto-lab/transfer/plan");
    expect(crypto).toContain("/api/crypto-lab/block/build");
    expect(crypto).toContain("Unsigned · unbroadcast · non-custodial");
    expect(crypto).toContain("not submitted to consensus");
  });

  it("registers the runtime routes in the canonical server", () => {
    expect(server).toContain('import { registerCryptoLabRoutes } from "./cryptoLab"');
    expect(server).toContain("registerCryptoLabRoutes(app)");
  });

  it("documents the open-source runtime boundary", () => {
    expect(docs).toContain("Bitcoin Core");
    expect(docs).toContain("Agave / Solana");
    expect(docs).toContain("Ethereum / EVM");
    expect(docs).toContain("No third-party source code is copied");
  });
});
