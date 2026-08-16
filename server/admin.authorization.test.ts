import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type UserRole = NonNullable<TrpcContext["user"]>["role"];

function createContext(role: UserRole): TrpcContext {
  return {
    user: {
      id: role === "admin" ? 2 : 1,
      openId: `${role}-user`,
      email: `${role}@example.com`,
      name: role === "admin" ? "Admin User" : "Regular User",
      loginMethod: "manus",
      role,
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

describe("admin authorization", () => {
  it("rejects authenticated non-admin users from admin stats", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    await expect(caller.admin.stats()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("allows an admin user to reach admin stats", async () => {
    const caller = appRouter.createCaller(createContext("admin"));

    await expect(caller.admin.stats()).resolves.toMatchObject({
      health: "UNAVAILABLE",
    });
  });

  it("rejects non-admin users from user listings and moderation queue", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    await expect(caller.admin.users()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(caller.admin.moderationQueue()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("rejects non-admin role mutations", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    await expect(
      caller.admin.updateUserRole({ userId: 2, role: "user" })
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("allows an admin to reach protected listings and role mutation boundary", async () => {
    const caller = appRouter.createCaller(createContext("admin"));

    await expect(caller.admin.users()).resolves.toEqual([]);
    await expect(caller.admin.moderationQueue()).resolves.toEqual([]);
    await expect(
      caller.admin.updateUserRole({ userId: 1, role: "user" })
    ).resolves.toMatchObject({
      available: false,
      status: "unavailable",
      success: false,
    });
  });
});
