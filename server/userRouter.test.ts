import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
  },
}));

import { db } from "./db";
import { userRouter } from "./userRouter";
import type { User } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

const profile: User = {
  id: "user-1",
  openId: "open-1",
  email: "profile@example.com",
  username: "profile_user",
  name: "Profile User",
  bio: "A persisted profile.",
  avatar: null,
  balance: 0,
  role: "user",
  verified: false,
  createdAt: new Date("2026-08-15T00:00:00.000Z"),
  updatedAt: new Date("2026-08-15T00:00:00.000Z"),
};

function createContext(): TrpcContext {
  return {
    user: profile,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("user profile contracts", () => {
  it("returns only public profile fields for the authenticated user", async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValueOnce(profile);

    const caller = userRouter.createCaller(createContext());
    const result = await caller.me();

    expect(result).toEqual({
      id: profile.id,
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      avatar: profile.avatar,
      verified: profile.verified,
      createdAt: profile.createdAt,
    });
  });

  it("returns a public profile by a validated username", async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValueOnce(profile);

    const caller = userRouter.createCaller(createContext());
    const result = await caller.profileByUsername({ username: "profile_user" });

    expect(result?.username).toBe("profile_user");
    expect(result).not.toHaveProperty("email");
    expect(result).not.toHaveProperty("balance");
  });

  it("returns null when a public username is not found", async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValueOnce(undefined);

    const caller = userRouter.createCaller(createContext());
    await expect(caller.profileByUsername({ username: "missing_user" })).resolves.toBeNull();
  });
});
