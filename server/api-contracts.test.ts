import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(authenticated = false): TrpcContext {
  const user: AuthenticatedUser | null = authenticated
    ? {
        id: 1,
        openId: "api-contract-test-user",
        email: "api-contract@example.com",
        name: "API Contract Test",
        loginMethod: "test",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

async function expectNotImplemented(action: () => Promise<unknown>, feature: string) {
  try {
    await action();
    throw new Error("Expected API call to fail as not implemented");
  } catch (error) {
    expect(error).toBeInstanceOf(TRPCError);
    expect((error as TRPCError).code).toBe("NOT_IMPLEMENTED");
    expect((error as TRPCError).message).toContain(feature);
  }
}

describe("unavailable feature API contracts", () => {
  it("does not fabricate list data for an unimplemented public endpoint", async () => {
    const caller = appRouter.createCaller(createContext());
    await expectNotImplemented(() => caller.feed.list(), "Feed");
  });

  it("does not fabricate mutation success for an unimplemented protected endpoint", async () => {
    const caller = appRouter.createCaller(createContext(true));
    await expectNotImplemented(
      () => caller.charity.create({ name: "test cause" }),
      "Charity",
    );
  });

  it("preserves registered compatibility routes while making their status truthful", async () => {
    const caller = appRouter.createCaller(createContext());
    await expectNotImplemented(
      () => caller.languageExchange.get("test"),
      "Language Exchange",
    );
  });
});
