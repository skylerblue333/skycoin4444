import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  comments,
  eventOutbox,
  likes,
  posts,
  users,
} from "../../drizzle/schema";
import {
  createDomainEvent,
  toOutboxRow,
} from "../../packages/event-fabric/src/index";
import { db } from "../db";
import { protectedProcedure, publicProcedure } from "../_core/trpc";

const postIdInput = z.object({ postId: z.string().min(1).max(255) });

export const createPostProcedure = protectedProcedure
  .input(
    z.object({
      content: z.string().trim().min(1).max(255),
      media: z.string().trim().max(255).nullable().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const id = randomUUID();
    const event = createDomainEvent({
      eventType: "social.post.created",
      schemaVersion: 1,
      producer: "skycoin4444.social",
      aggregate: { type: "social.post", id },
      correlationId: ctx.requestId,
      actorId: ctx.user.id,
      payload: {
        postId: id,
        userId: ctx.user.id,
        hasMedia: Boolean(input.media),
      },
      metadata: { source: "trpc" },
    });

    await db.transaction(async tx => {
      await tx.insert(posts).values({
        id,
        userId: ctx.user.id,
        content: input.content,
        media: input.media ?? null,
        likes: 0,
        comments: 0,
      });
      await tx.insert(eventOutbox).values(toOutboxRow(event));
    });

    return {
      id,
      userId: ctx.user.id,
      content: input.content,
      media: input.media ?? null,
    };
  });

export const deletePostProcedure = protectedProcedure
  .input(postIdInput)
  .mutation(async ({ ctx, input }) => {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, input.postId),
    });
    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
    }
    if (post.userId !== ctx.user.id && ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You can only delete your own posts",
      });
    }

    await db.transaction(async tx => {
      await tx.delete(likes).where(eq(likes.postId, input.postId));
      await tx.delete(comments).where(eq(comments.postId, input.postId));
      await tx.delete(posts).where(eq(posts.id, input.postId));
    });

    return { deleted: true, postId: input.postId } as const;
  });

export const listCommentsProcedure = publicProcedure
  .input(
    postIdInput.extend({
      limit: z.number().int().min(1).max(100).default(30),
    })
  )
  .query(async ({ input }) => {
    const rows = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        userId: comments.userId,
        content: comments.content,
        createdAt: comments.createdAt,
        authorId: users.id,
        authorUsername: users.username,
        authorName: users.name,
        authorAvatar: users.avatar,
        authorVerified: users.verified,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, input.postId))
      .orderBy(desc(comments.createdAt))
      .limit(input.limit);

    return rows.map(row => ({
      id: row.id,
      postId: row.postId,
      userId: row.userId,
      content: row.content,
      createdAt: row.createdAt,
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

export const addCommentProcedure = protectedProcedure
  .input(
    postIdInput.extend({
      content: z.string().trim().min(1).max(255),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, input.postId),
    });
    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
    }

    const id = randomUUID();
    await db.transaction(async tx => {
      await tx.insert(comments).values({
        id,
        postId: input.postId,
        userId: ctx.user.id,
        content: input.content,
      });
      await tx
        .update(posts)
        .set({ comments: sql`COALESCE(${posts.comments}, 0) + 1` })
        .where(eq(posts.id, input.postId));
    });

    return {
      id,
      postId: input.postId,
      userId: ctx.user.id,
      content: input.content,
    };
  });

export const likePostProcedure = protectedProcedure
  .input(postIdInput)
  .mutation(async ({ ctx, input }) => {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, input.postId),
    });
    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
    }

    const existing = await db.query.likes.findFirst({
      where: and(
        eq(likes.postId, input.postId),
        eq(likes.userId, ctx.user.id)
      ),
    });
    if (existing) return { liked: true, created: false } as const;

    await db.transaction(async tx => {
      await tx.insert(likes).values({
        id: randomUUID(),
        postId: input.postId,
        userId: ctx.user.id,
      });
      await tx
        .update(posts)
        .set({ likes: sql`COALESCE(${posts.likes}, 0) + 1` })
        .where(eq(posts.id, input.postId));
    });

    return { liked: true, created: true } as const;
  });

export const unlikePostProcedure = protectedProcedure
  .input(postIdInput)
  .mutation(async ({ ctx, input }) => {
    const existing = await db.query.likes.findFirst({
      where: and(
        eq(likes.postId, input.postId),
        eq(likes.userId, ctx.user.id)
      ),
    });
    if (!existing) return { liked: false, removed: false } as const;

    await db.transaction(async tx => {
      await tx
        .delete(likes)
        .where(
          and(
            eq(likes.postId, input.postId),
            eq(likes.userId, ctx.user.id)
          )
        );
      await tx
        .update(posts)
        .set({
          likes: sql`GREATEST(COALESCE(${posts.likes}, 0) - 1, 0)`,
        })
        .where(eq(posts.id, input.postId));
    });

    return { liked: false, removed: true } as const;
  });
