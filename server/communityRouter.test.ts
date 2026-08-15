import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  db: {
    query: {
      posts: { findMany: vi.fn(), findFirst: vi.fn() },
    },
    insert: vi.fn(),
    delete: vi.fn(),
  },
}));

import { db } from "./db";
import { communityRouter } from "./communityRouter";
import type { Post, User } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

const user: User = {
  id: "user-1",
  openId: "open-1",
  email: "community@example.com",
  username: "community_user",
  name: "Community User",
  bio: null,
  avatar: null,
  balance: 0,
  role: "user",
  verified: false,
  createdAt: new Date("2026-08-15T00:00:00.000Z"),
  updatedAt: new Date("2026-08-15T00:00:00.000Z"),
};

const post: Post = {
  id: "post-1",
  userId: user.id,
  content: "A persisted community post.",
  media: null,
  likes: 0,
  comments: 0,
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

describe("community post contracts", () => {
  it("lists persisted posts without inventing engagement values", async () => {
    vi.mocked(db.query.posts.findMany).mockResolvedValueOnce([post]);

    const caller = communityRouter.createCaller(createContext());
    const result = await caller.listPosts({ limit: 10, offset: 0 });

    expect(result).toEqual([{
      id: post.id,
      userId: post.userId,
      content: post.content,
      media: post.media,
      likes: post.likes,
      comments: post.comments,
      createdAt: post.createdAt,
    }]);
  });

  it("rejects empty post content before persistence", async () => {
    const caller = communityRouter.createCaller(createContext());

    await expect(caller.createPost({ content: "   " })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("prevents deleting another user’s post", async () => {
    vi.mocked(db.query.posts.findFirst).mockResolvedValueOnce({
      ...post,
      userId: "another-user",
    });

    const caller = communityRouter.createCaller(createContext());

    await expect(caller.deleteOwnPost({ postId: post.id })).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "You can only delete your own posts.",
    });
  });
});
