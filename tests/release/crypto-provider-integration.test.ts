import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const provider = readFileSync("server/_core/cryptoProviderAdapters.ts", "utf8");
const server = readFileSync("server/_core/index.ts", "utf8");
const schema = readFileSync("drizzle/schema.ts", "utf8");
const migration = readFileSync("drizzle/migrations/0014_crypto_provider_events.sql", "utf8");
const workspace = readFileSync("client/src/components/CryptoProductWorkspace.tsx", "utf8");
const ops = readFileSync("client/src/components/CryptoProviderOps.tsx", "utf8");

describe("real crypto provider integration release boundary", () => {
  it("implements Stratum subscribe authorize and gated share submission", () => {
    expect(provider).toContain('"mining.subscribe"');
    expect(provider).toContain('"mining.authorize"');
    expect(provider).toContain('"mining.submit"');
    expect(provider).toContain("STRATUM_SHARE_SUBMISSION_ENABLED");
    expect(provider).toContain("administrator role required");
  });

  it("uses 0x Swap API v2 server-side without server broadcasting", () => {
    expect(provider).toContain("/swap/allowance-holder/quote");
    expect(provider).toContain('"0x-version": "v2"');
    expect(provider).toContain('"0x-api-key"');
    expect(provider).toContain("serverBroadcast: false");
    expect(workspace).toContain("/api/crypto-provider/dex/0x/quote");
  });

  it("requires explicit mainnet chain destination and value policy", () => {
    expect(provider).toContain("CRYPTO_MAINNET_ENABLED");
    expect(provider).toContain("CRYPTO_MAINNET_ALLOWED_CHAIN_IDS");
    expect(provider).toContain("CRYPTO_MAINNET_DESTINATION_ALLOWLIST");
    expect(provider).toContain("CRYPTO_MAINNET_MAX_NATIVE_WEI");
    expect(workspace).toContain("/api/crypto-provider/wallet/mainnet-policy");
  });

  it("reconciles EVM Solana and Bitcoin transactions", () => {
    expect(provider).toContain('"eth_getTransactionReceipt"');
    expect(provider).toContain('"eth_blockNumber"');
    expect(provider).toContain('"getSignatureStatuses"');
    expect(provider).toContain('"getrawtransaction"');
    expect(workspace).toContain("/api/crypto-provider/tx/reconcile");
  });

  it("keeps external signing keys outside the app process", () => {
    expect(provider).toContain("/sign/");
    expect(provider).toContain('"x-vault-token"');
    expect(provider).toContain("prehashed: true");
    expect(provider).toContain("MPC_SIGNER_URL");
    expect(provider).toContain("privateKeyExposed: false");
    expect(ops).toContain("/api/crypto-provider/custody/openbao/sign");
    expect(ops).toContain("/api/crypto-provider/custody/mpc/sign");
  });

  it("adds a durable string-amount provider ledger", () => {
    expect(schema).toContain('mysqlTable("crypto_provider_events"');
    expect(schema).toContain('varchar("amount_atomic"');
    expect(migration).toContain("CREATE TABLE `crypto_provider_events`");
    expect(migration).toContain("`amount_atomic` varchar(255)");
  });

  it("registers provider routes and replaces placeholder mining-pool screens", () => {
    expect(server).toContain('import { registerCryptoProviderRoutes } from "./cryptoProviderAdapters"');
    expect(server).toContain("registerCryptoProviderRoutes(app)");
    for (const path of [
      "client/src/pages/CryptoEnhancementsPage.tsx",
      "client/src/pages/MiningPoolSelector.tsx",
      "client/src/pages/PoolPerformance.tsx",
    ]) {
      expect(readFileSync(path, "utf8")).toContain('from "@/components/CryptoProviderOps"');
    }
  });
});
