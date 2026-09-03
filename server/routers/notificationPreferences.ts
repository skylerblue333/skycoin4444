import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { notificationPreferences } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const defaults = { inAppEnabled: true, productUpdatesEnabled: false, securityAlertsEnabled: true } as const;
const updateInput = z.object({
  inAppEnabled: z.boolean(),
  productUpdatesEnabled: z.boolean(),
  securityAlertsEnabled: z.boolean(),
});

export const notificationPreferencesRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const existing = await db.query.notificationPreferences.findFirst({ where: eq(notificationPreferences.userId, ctx.user.id) });
    return existing ?? { id: null, userId: ctx.user.id, ...defaults, updatedAt: null };
  }),
  update: protectedProcedure.input(updateInput).mutation(async ({ ctx, input }) => {
    const existing = await db.query.notificationPreferences.findFirst({ where: eq(notificationPreferences.userId, ctx.user.id) });
    if (existing) {
      await db.update(notificationPreferences).set({ ...input, updatedAt: new Date() }).where(eq(notificationPreferences.userId, ctx.user.id));
      return { ...existing, ...input };
    }
    const id = randomUUID();
    await db.insert(notificationPreferences).values({ id, userId: ctx.user.id, ...input });
    return { id, userId: ctx.user.id, ...input, updatedAt: new Date() };
  }),
});
