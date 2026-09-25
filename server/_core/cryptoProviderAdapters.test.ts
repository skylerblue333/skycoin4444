import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cryptoProviderConfigSnapshot,
  evaluateMainnetWalletPolicy,
  fetchZeroExQuote,
  probeStratumPool,
  reconcileMiningPayouts,
  reconcileTransaction,
  signDigestWithMpcGateway,
  signDigestWithOpenBao,
} from "./cryptoProviderAdapters";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("crypto real provider adapters", () => {
  it("reports providers fail-closed when credentials are absent", () => {
    const status = cryptoProviderConfigSnapshot({});
    expect(status.stratum.configured).toBe(false);
    expect(status.dex.configured).toBe(false);
    expect(status.mainnetPolicy.enabled).toBe(false);
    expect(status.custody.openBaoConfigured).toBe(false);
    expect(status.custody.mpcGatewayConfigured).toBe(false);
  });

  it("keeps mainnet denied unless chain, destination, and value are explicitly allowed", () => {
    const env = {
      CRYPTO_MAINNET_ENABLED: "true",
      CRYPTO_MAINNET_ALLOWED_CHAIN_IDS: "1,8453",
      CRYPTO_MAINNET_DESTINATION_ALLOWLIST:
        "0x1111111111111111111111111111111111111111",
      CRYPTO_MAINNET_MAX_NATIVE_WEI: "1000",
    };

    expect(
      evaluateMainnetWalletPolicy(
        {
          chainId: 1,
          to: "0x1111111111111111111111111111111111111111",
          valueWei: "1000",
          purpose: "transfer",
        },
        env,
      ).allowed,
    ).toBe(true);

    const blocked = evaluateMainnetWalletPolicy(
      {
        chainId: 1,
        to: "0x2222222222222222222222222222222222222222",
        valueWei: "1001",
        purpose: "dex-swap",
      },
      env,
    );
    expect(blocked.allowed).toBe(false);
    expect(blocked.reasons).toContain("destination is not allowlisted");
    expect(blocked.reasons).toContain("native value exceeds configured maximum");
  });

  it("reconciles settled and pending mining payouts in atomic units", () => {
    const result = reconcileMiningPayouts("150", [
      {
        id: "payout:1",
        asset: "BTC",
        amountAtomic: "100",
        txHash: "abc",
        status: "confirmed",
        createdAt: null,
      },
      {
        id: "payout:2",
        asset: "BTC",
        amountAtomic: "40",
        txHash: null,
        status: "pending",
        createdAt: null,
      },
      {
        id: "payout:3",
        asset: "BTC",
        amountAtomic: "50",
        txHash: "def",
        status: "paid",
        createdAt: null,
      },
    ]);
    expect(result.settledAtomic).toBe("150");
    expect(result.pendingAtomic).toBe("40");
    expect(result.varianceAtomic).toBe("0");
    expect(result.balanced).toBe(true);
  });

  it("calls the current 0x v2 allowance-holder quote contract without broadcasting", async () => {
    const fetchMock = vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      const url = String(input);
      expect(url).toContain("/swap/allowance-holder/quote");
      expect(url).toContain("chainId=1");
      expect(init?.headers).toMatchObject({
        "0x-api-key": "test-key",
        "0x-version": "v2",
      });
      return new Response(
        JSON.stringify({
          liquidityAvailable: true,
          buyAmount: "950",
          minBuyAmount: "900",
          allowanceTarget: "0x3333333333333333333333333333333333333333",
          issues: {},
          fees: {},
          route: { fills: [] },
          transaction: {
            to: "0x4444444444444444444444444444444444444444",
            data: "0x1234",
            value: "0",
            gas: "21000",
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const quote = await fetchZeroExQuote(
      {
        chainId: 1,
        sellToken: "0x1111111111111111111111111111111111111111",
        buyToken: "0x2222222222222222222222222222222222222222",
        sellAmount: "1000",
        taker: "0x5555555555555555555555555555555555555555",
        slippageBps: 100,
      },
      { ZEROX_API_KEY: "test-key" },
    );

    expect(quote.provider).toBe("0x-swap-api-v2");
    expect(quote.buyAmount).toBe("950");
    expect(quote.transaction.to).toBe("0x4444444444444444444444444444444444444444");
    expect(quote.executableByWallet).toBe(true);
    expect(quote.serverBroadcast).toBe(false);
  });

  it("reconciles EVM confirmations from the configured chain RPC", async () => {
    const fetchMock = vi.fn(async (_input: URL | RequestInfo, init?: RequestInit) => {
      const request = JSON.parse(String(init?.body)) as { method: string };
      const result =
        request.method === "eth_getTransactionReceipt"
          ? { status: "0x1", blockNumber: "0x64" }
          : "0x66";
      return new Response(JSON.stringify({ jsonrpc: "2.0", id: "skycoin4444", result }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await reconcileTransaction(
      {
        network: "evm",
        chainId: 1,
        txHash: "0x" + "a".repeat(64),
        minConfirmations: 2,
      },
      { ETHEREUM_RPC_URL: "https://rpc.example.test" },
    );

    expect(result.status).toBe("confirmed");
    expect(result.confirmations).toBe(3);
    expect(result.confirmed).toBe(true);
  });

  it("signs a prehashed digest through OpenBao without returning a private key", async () => {
    const fetchMock = vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      expect(String(input)).toContain("/v1/transit/sign/sky4-key/sha2-256");
      const body = JSON.parse(String(init?.body)) as { input: string; prehashed: boolean };
      expect(body.prehashed).toBe(true);
      expect(Buffer.from(body.input, "base64")).toHaveLength(32);
      return new Response(
        JSON.stringify({ data: { signature: "vault:v1:test-signature" } }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await signDigestWithOpenBao(
      { digestHex: "ab".repeat(32) },
      {
        OPENBAO_URL: "https://bao.example.test",
        OPENBAO_TOKEN: "token",
        OPENBAO_TRANSIT_KEY: "sky4-key",
        OPENBAO_SIGNING_ENABLED: "true",
      },
    );

    expect(result.signature).toBe("vault:v1:test-signature");
    expect(result.privateKeyExposed).toBe(false);
  });

  it("uses an idempotent authenticated MPC signer gateway contract", async () => {
    const fetchMock = vi.fn(async (_input: URL | RequestInfo, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({
        authorization: "Bearer mpc-token",
        "content-type": "application/json",
      });
      const body = JSON.parse(String(init?.body)) as {
        keyId: string;
        digestHex: string;
        algorithm: string;
      };
      expect(body.keyId).toBe("mpc-key-1");
      expect(body.digestHex).toBe("cd".repeat(32));
      return new Response(JSON.stringify({ signature: "0xsigned" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await signDigestWithMpcGateway(
      { digestHex: "cd".repeat(32) },
      {
        MPC_SIGNER_URL: "https://mpc.example.test/sign",
        MPC_SIGNER_TOKEN: "mpc-token",
        MPC_KEY_ID: "mpc-key-1",
        MPC_SIGNING_ENABLED: "true",
      },
    );

    expect(result.signature).toBe("0xsigned");
    expect(result.privateKeyExposed).toBe(false);
  });

  it("does not attempt a Stratum network connection when no pool is configured", async () => {
    await expect(probeStratumPool({})).resolves.toMatchObject({
      configured: false,
      connected: false,
      authorized: false,
    });
  });
});
