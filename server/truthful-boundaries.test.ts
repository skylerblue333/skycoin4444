import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "truthful-boundary-user",
      email: "truthful@example.com",
      name: "Truthful Boundary User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("truthful unsupported-operation boundaries", () => {
  it("does not report wallet connection as successful", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.wallet.connectWallet({
        walletAddress: "0x0000000000000000000000000000000000000001",
        chainId: 1,
        walletType: "external",
      })
    ).resolves.toMatchObject({
      available: false,
      status: "unavailable",
    });
  });

  it("does not report transaction signing as successful", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.blockchain.buildAndSign({
        to: "0x0000000000000000000000000000000000000001",
        valueWei: "0",
        chainId: 1,
      })
    ).resolves.toMatchObject({
      available: false,
      status: "unavailable",
      txHash: "",
    });
  });

  it("does not report AI generation as available", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.ai.chat({ message: "Summarize this test." })
    ).resolves.toMatchObject({
      available: false,
      status: "unavailable",
      reply: "",
    });
  });
});
