import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import * as schema from "../drizzle/schema";
import { db } from "./db";
import { protectedProcedure, router } from "./_core/trpc";

const listInput = z.object({
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

const notificationIdInput = z.object({
  notificationId: z.string().trim().min(1).max(255),
});

export const notificationRouter = router({
  list: protectedProcedure.input(listInput).query(async ({ ctx, input }) => {
    try {
      return await db.query.notifications.findMany({
        where: eq(schema.notifications.userId, ctx.user.id),
        orderBy: desc(schema.notifications.createdAt),
        limit: input.limit,
        offset: input.offset,
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to load notifications.",
        cause: error,
      });
    }
  }),

  markRead: protectedProcedure
    .input(notificationIdInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const notification = await db.query.notifications.findFirst({
          where: and(
            eq(schema.notifications.id, input.notificationId),
            eq(schema.notifications.userId, ctx.user.id)
          ),
        });
        if (!notification) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Notification not found.",
          });
        }

        await db
          .update(schema.notifications)
          .set({ read: true })
          .where(
            and(
              eq(schema.notifications.id, input.notificationId),
              eq(schema.notifications.userId, ctx.user.id)
            )
          );
        return { success: true } as const;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to mark the notification as read.",
          cause: error,
        });
      }
    }),
});
