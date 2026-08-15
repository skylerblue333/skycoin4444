import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import * as schema from "../drizzle/schema";
import { db } from "./db";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const listInput = z.object({
  limit: z.number().int().min(1).max(50).default(20),
  offset: z.number().int().min(0).default(0),
});

const createInput = z.object({
  content: z.string().trim().min(1).max(255),
  media: z.string().trim().max(255).nullable().optional(),
});

const postIdInput = z.object({ postId: z.string().trim().min(1).max(255) });

function toPublicPost(post: typeof schema.posts.$inferSelect) {
  return {
    id: post.id,
    userId: post.userId,
    content: post.content,
    media: post.media,
    likes: post.likes,
    comments: post.comments,
    createdAt: post.createdAt,
  };
}

export const communityRouter = router({
  listPosts: publicProcedure.input(listInput).query(async ({ input }) => {
    try {
      const posts = await db.query.posts.findMany({
        orderBy: desc(schema.posts.createdAt),
        limit: input.limit,
        offset: input.offset,
      });
      return posts.map(toPublicPost);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to load community posts.",
        cause: error,
      });
    }
  }),

  createPost: protectedProcedure.input(createInput).mutation(async ({ ctx, input }) => {
    const id = randomUUID();
    try {
      await db.insert(schema.posts).values({
        id,
        userId: ctx.user.id,
        content: input.content,
        media: input.media ?? null,
        likes: 0,
        comments: 0,
      });

      const post = await db.query.posts.findFirst({
        where: eq(schema.posts.id, id),
      });
      if (!post) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "The post was created but could not be loaded.",
        });
      }
      return toPublicPost(post);
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to create the community post.",
        cause: error,
      });
    }
  }),

  deleteOwnPost: protectedProcedure
    .input(postIdInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await db.query.posts.findFirst({
          where: eq(schema.posts.id, input.postId),
        });
        if (!post) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Post not found." });
        }
        if (post.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only delete your own posts.",
          });
        }

        await db.delete(schema.posts).where(eq(schema.posts.id, input.postId));
        return { success: true } as const;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete the community post.",
          cause: error,
        });
      }
    }),
});
