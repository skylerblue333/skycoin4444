import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import * as schema from "../drizzle/schema";
import { db } from "./db";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const postInput = z.object({
  postId: z.string().trim().min(1).max(255),
});

const createInput = postInput.extend({
  content: z.string().trim().min(1).max(255),
});

const commentInput = z.object({
  commentId: z.string().trim().min(1).max(255),
});

export const commentsRouter = router({
  listByPost: publicProcedure.input(postInput).query(async ({ input }) => {
    try {
      return await db.query.comments.findMany({
        where: eq(schema.comments.postId, input.postId),
        orderBy: asc(schema.comments.createdAt),
        limit: 100,
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to load post comments.",
        cause: error,
      });
    }
  }),

  create: protectedProcedure.input(createInput).mutation(async ({ ctx, input }) => {
    try {
      const post = await db.query.posts.findFirst({
        where: eq(schema.posts.id, input.postId),
      });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found." });
      }

      const id = randomUUID();
      await db.insert(schema.comments).values({
        id,
        postId: input.postId,
        userId: ctx.user.id,
        content: input.content,
      });

      const comment = await db.query.comments.findFirst({
        where: eq(schema.comments.id, id),
      });
      if (!comment) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "The comment was created but could not be loaded.",
        });
      }
      return comment;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to create the comment.",
        cause: error,
      });
    }
  }),

  deleteOwn: protectedProcedure
    .input(commentInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = await db.query.comments.findFirst({
          where: eq(schema.comments.id, input.commentId),
        });
        if (!comment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Comment not found." });
        }
        if (comment.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only delete your own comments.",
          });
        }

        await db.delete(schema.comments).where(eq(schema.comments.id, input.commentId));
        return { success: true } as const;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete the comment.",
          cause: error,
        });
      }
    }),
});
