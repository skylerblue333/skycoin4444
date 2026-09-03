import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { discoveryBookmarks, searchHistory } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const kind = z.enum(["user", "post", "product"]);
const bookmarkInput = z.object({
  targetKind: kind,
  targetId: z.string().trim().min(1).max(255),
  title: z.string().trim().min(1).max(255),
  detail: z.string().trim().min(1).max(4000),
});

export const discoveryRouter = router({
  bookmarks: protectedProcedure.query(({ ctx }) => db.select().from(discoveryBookmarks).where(eq(discoveryBookmarks.userId, ctx.user.id)).orderBy(desc(discoveryBookmarks.createdAt)).limit(100)),
  saveBookmark: protectedProcedure.input(bookmarkInput).mutation(async ({ ctx, input }) => {
    const existing = await db.query.discoveryBookmarks.findFirst({ where: and(eq(discoveryBookmarks.userId, ctx.user.id), eq(discoveryBookmarks.targetKind, input.targetKind), eq(discoveryBookmarks.targetId, input.targetId)) });
    if (existing) return existing;
    const id = randomUUID();
    await db.insert(discoveryBookmarks).values({ id, userId: ctx.user.id, ...input });
    return { id, userId: ctx.user.id, ...input };
  }),
  deleteBookmark: protectedProcedure.input(z.object({ targetKind: kind, targetId: z.string().trim().min(1).max(255) })).mutation(async ({ ctx, input }) => {
    await db.delete(discoveryBookmarks).where(and(eq(discoveryBookmarks.userId, ctx.user.id), eq(discoveryBookmarks.targetKind, input.targetKind), eq(discoveryBookmarks.targetId, input.targetId)));
    return { success: true as const };
  }),
  clearBookmarks: protectedProcedure.mutation(async ({ ctx }) => {
    await db.delete(discoveryBookmarks).where(eq(discoveryBookmarks.userId, ctx.user.id));
    return { success: true as const };
  }),
  history: protectedProcedure.query(({ ctx }) => db.select().from(searchHistory).where(eq(searchHistory.userId, ctx.user.id)).orderBy(desc(searchHistory.createdAt)).limit(25)),
  recordSearch: protectedProcedure.input(z.object({ query: z.string().trim().min(2).max(100) })).mutation(async ({ ctx, input }) => {
    const id = randomUUID();
    await db.insert(searchHistory).values({ id, userId: ctx.user.id, query: input.query });
    return { id, query: input.query };
  }),
  clearHistory: protectedProcedure.mutation(async ({ ctx }) => {
    await db.delete(searchHistory).where(eq(searchHistory.userId, ctx.user.id));
    return { success: true as const };
  }),
});
