import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  db: {
    query: {
      messages: { findMany: vi.fn(), findFirst: vi.fn() },
      users: { findMany: vi.fn(), findFirst: vi.fn() },
    },
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { db } from "./db";
import { messagesRouter } from "./messagesRouter";
import type { User } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

const user: User = {
  id: "user-1",
  openId: "open-1",
  email: "messages@example.com",
  username: "messages_user",
  name: "Messages User",
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

describe("message safety contracts", () => {
  it("rejects a thread addressed to the authenticated user", async () => {
    const caller = messagesRouter.createCaller(createContext());

    await expect(caller.thread({ participantId: user.id })).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "Choose another participant.",
    });
  });

  it("requires a recipient when sending a message", async () => {
    const caller = messagesRouter.createCaller(createContext());

    await expect(caller.send({ content: "Missing recipient" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("rejects sending a message to the authenticated user", async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValueOnce({
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
    });

    const caller = messagesRouter.createCaller(createContext());

    await expect(
      caller.send({ recipientId: user.id, content: "Do not send to self" })
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "You cannot message your own account.",
    });
  });
});
