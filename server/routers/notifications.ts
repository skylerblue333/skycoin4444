import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { notificationPreferences, notifications } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const notificationsRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).default(30),
          unreadOnly: z.boolean().default(false),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
          const limit = input?.limit ?? 30;
    const unreadOnly = input?.unreadOnly ?? false;
    const preferences = await db.query.notificationPreferences.findFirst({ where: eq(notificationPreferences.userId, ctx.user.id) });
    if (preferences && !preferences.inAppEnabled) return [];

      const ownership = eq(notifications.userId, ctx.user.id);
      const where = unreadOnly
        ? and(ownership, eq(notifications.read, false))
        : ownership;

      return db
        .select()
        .from(notifications)
        .where(where)
        .orderBy(desc(notifications.createdAt))
        .limit(limit);
    }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const preferences = await db.query.notificationPreferences.findFirst({ where: eq(notificationPreferences.userId, ctx.user.id) });
    if (preferences && !preferences.inAppEnabled) return { count: 0 };
    const rows = await db
      .select({ id: notifications.id })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.read, false)
        )
      );

    return { count: rows.length };
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.notifications.findFirst({
        where: and(
          eq(notifications.id, input.id),
          eq(notifications.userId, ctx.user.id)
        ),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification not found",
        });
      }

      await db
        .update(notifications)
        .set({ read: true })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.user.id)
          )
        );

      return { id: input.id, read: true } as const;
    }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true } as const;
  }),
});
