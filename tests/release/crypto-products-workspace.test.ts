import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workspace = readFileSync("client/src/components/CryptoProductWorkspace.tsx", "utf8");
const server = readFileSync("server/_core/index.ts", "utf8");
const contracts = readFileSync("server/_core/cryptoProducts.ts", "utf8");

const routedPages = [
  "client/src/pages/WalletConnect.tsx",
  "client/src/pages/SendCrypto.tsx",
  "client/src/pages/ReceiveCrypto.tsx",
  "client/src/pages/BlockchainCustody.tsx",
  "client/src/pages/SwapInterface.tsx",
  "client/src/pages/CrossChainSwap.tsx",
  "client/src/pages/LiquidityPools.tsx",
  "client/src/pages/CryptoExchange.tsx",
  "client/src/pages/Trading.tsx",
  "client/src/pages/TradingTerminal.tsx",
  "client/src/pages/SkyStore.tsx",
];

describe("crypto product workspace release contract", () => {
  it("uses browser-wallet signing and limits broadcasting to testnets", () => {
    expect(workspace).toContain("eth_requestAccounts");
    expect(workspace).toContain("personal_sign");
    expect(workspace).toContain("eth_sendTransaction");
    expect(workspace).toContain('"0xaa36a7": "Ethereum Sepolia"');
    expect(workspace).toContain('"0x14a34": "Base Sepolia"');
    expect(workspace).toContain("Private keys never enter SKYCOIN4444");
  });

  it("connects swap, pool, trade, and store forms to server contracts", () => {
    expect(workspace).toContain("/api/crypto-products/swap/quote");
    expect(workspace).toContain("/api/crypto-products/liquidity/deposit-plan");
    expect(workspace).toContain("/api/crypto-products/trade/order-plan");
    expect(workspace).toContain("/api/crypto-products/store/checkout-plan");
  });

  it("keeps live custody and mainnet financial execution fail-closed", () => {
    expect(contracts).toContain("serverCustody: false");
    expect(contracts).toContain("mainnetBroadcast: false");
    expect(contracts).toContain("liveDexExecution: false");
    expect(contracts).toContain("liveVenueExecution: false");
    expect(contracts).toContain("liveSettlement: false");
    expect(contracts).toContain("payouts: false");
  });

  it("registers the crypto product routes in the canonical server", () => {
    expect(server).toContain('import { registerCryptoProductRoutes } from "./cryptoProducts"');
    expect(server).toContain("registerCryptoProductRoutes(app)");
  });

  it("replaces legacy fake-live pages with the shared workspace", () => {
    for (const page of routedPages) {
      const source = readFileSync(page, "utf8");
      expect(source).toContain('from "@/components/CryptoProductWorkspace"');
      expect(source).not.toContain("Math.random()");
      expect(source).not.toContain("Fully functional");
      expect(source).not.toContain("Live Market");
    }
  });
});
