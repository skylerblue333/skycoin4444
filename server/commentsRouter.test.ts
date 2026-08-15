import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  db: {
    query: {
      comments: { findMany: vi.fn(), findFirst: vi.fn() },
      posts: { findFirst: vi.fn() },
    },
    insert: vi.fn(),
    delete: vi.fn(),
  },
}));

import { db } from "./db";
import { commentsRouter } from "./commentsRouter";
import type { Post, User } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

const user: User = {
  id: "user-1",
  openId: "open-1",
  email: "comments@example.com",
  username: "comments_user",
  name: "Comments User",
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
  content: "Persisted post",
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

describe("comment safety contracts", () => {
  it("returns an empty persisted comment list for a post without comments", async () => {
    vi.mocked(db.query.comments.findMany).mockResolvedValueOnce([]);

    const caller = commentsRouter.createCaller(createContext());
    await expect(caller.listByPost({ postId: post.id })).resolves.toEqual([]);
  });

  it("rejects creation when the target post is missing", async () => {
    vi.mocked(db.query.posts.findFirst).mockResolvedValueOnce(undefined);

    const caller = commentsRouter.createCaller(createContext());
    await expect(
      caller.create({ postId: "missing-post", content: "Comment" })
    ).rejects.toMatchObject({ code: "NOT_FOUND", message: "Post not found." });
  });

  it("prevents deleting another user’s comment", async () => {
    vi.mocked(db.query.comments.findFirst).mockResolvedValueOnce({
      id: "comment-1",
      postId: post.id,
      userId: "another-user",
      content: "Not mine",
      createdAt: new Date("2026-08-15T00:00:00.000Z"),
    });

    const caller = commentsRouter.createCaller(createContext());
    await expect(caller.deleteOwn({ commentId: "comment-1" })).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "You can only delete your own comments.",
    });
  });
});
