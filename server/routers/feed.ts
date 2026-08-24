import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { likes, posts, users } from "../../drizzle/schema";
import { db } from "../db";
import { publicProcedure } from "../_core/trpc";

const feedInput = z
  .object({
    limit: z.number().int().min(1).max(50).default(20),
    offset: z.number().int().min(0).max(10_000).default(0),
  })
  .optional();

export const getSkyFeedProcedure = publicProcedure
  .input(feedInput)
  .query(async ({ ctx, input }) => {
    const limit = input?.limit ?? 20;
    const offset = input?.offset ?? 0;

    const rows = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        media: posts.media,
        likeCount: posts.likes,
        commentCount: posts.comments,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: users.id,
        authorUsername: users.username,
        authorName: users.name,
        authorAvatar: users.avatar,
        authorVerified: users.verified,
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const postIds = rows.map(row => row.id);
    const likedRows = ctx.user && postIds.length
      ? await db
          .select({ postId: likes.postId })
          .from(likes)
          .where(and(eq(likes.userId, ctx.user.id), inArray(likes.postId, postIds)))
      : [];
    const likedPostIds = new Set(likedRows.map(row => row.postId).filter(Boolean));

    return rows.map(row => ({
      id: row.id,
      userId: row.userId,
      content: row.content,
      media: row.media,
      likeCount: row.likeCount ?? 0,
      commentCount: row.commentCount ?? 0,
      likedByMe: likedPostIds.has(row.id),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      author: row.authorId
        ? {
            id: row.authorId,
            username: row.authorUsername,
            name: row.authorName,
            avatar: row.authorAvatar,
            verified: row.authorVerified ?? false,
          }
        : null,
    }));
  });
