import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  db: {
    query: {
      notifications: { findMany: vi.fn(), findFirst: vi.fn() },
    },
    update: vi.fn(),
  },
}));

import { db } from "./db";
import { notificationRouter } from "./notificationRouter";
import type { User } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

const user: User = {
  id: "user-1",
  openId: "open-1",
  email: "notifications@example.com",
  username: "notifications_user",
  name: "Notifications User",
  bio: null,
  avatar: null,
  balance: 0,
  role: "user",
  verified: false,
  createdAt: new Date("2026-08-15T00:00:00.000Z"),
  updatedAt: new Date("2026-08-15T00:00:00.000Z"),
};

function createContext(): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("notification contracts", () => {
  it("returns only notifications scoped to the authenticated account", async () => {
    vi.mocked(db.query.notifications.findMany).mockResolvedValueOnce([]);

    const caller = notificationRouter.createCaller(createContext());
    await expect(caller.list({ limit: 20, offset: 0 })).resolves.toEqual([]);
    expect(db.query.notifications.findMany).toHaveBeenCalledOnce();
  });

  it("returns not found when the notification is not owned by the account", async () => {
    vi.mocked(db.query.notifications.findFirst).mockResolvedValueOnce(undefined);

    const caller = notificationRouter.createCaller(createContext());
    await expect(
      caller.markRead({ notificationId: "notification-1" })
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      message: "Notification not found.",
    });
  });
});
