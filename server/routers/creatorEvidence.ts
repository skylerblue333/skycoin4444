import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { creatorEvidenceDrafts } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const status = z.enum(["draft", "ready_for_review", "archived"]);
const draftInput = z.object({
  title: z.string().trim().min(3).max(120),
  brief: z.string().trim().min(10).max(4000),
});

export const creatorEvidenceRouter = router({
  list: protectedProcedure.query(({ ctx }) => db.select().from(creatorEvidenceDrafts).where(eq(creatorEvidenceDrafts.userId, ctx.user.id)).orderBy(desc(creatorEvidenceDrafts.updatedAt)).limit(100)),
  create: protectedProcedure.input(draftInput).mutation(async ({ ctx, input }) => {
    const id = randomUUID();
    await db.insert(creatorEvidenceDrafts).values({ id, userId: ctx.user.id, ...input });
    return { id, userId: ctx.user.id, ...input, status: "draft" as const };
  }),
  setStatus: protectedProcedure.input(z.object({ id: z.string().min(1).max(255), status })).mutation(async ({ ctx, input }) => {
    const existing = await db.query.creatorEvidenceDrafts.findFirst({ where: and(eq(creatorEvidenceDrafts.id, input.id), eq(creatorEvidenceDrafts.userId, ctx.user.id)) });
    if (!existing) throw new Error("Creator draft not found");
    await db.update(creatorEvidenceDrafts).set({ status: input.status, updatedAt: new Date() }).where(and(eq(creatorEvidenceDrafts.id, input.id), eq(creatorEvidenceDrafts.userId, ctx.user.id)));
    return { id: input.id, status: input.status };
  }),
  delete: protectedProcedure.input(z.object({ id: z.string().min(1).max(255) })).mutation(async ({ ctx, input }) => {
    await db.delete(creatorEvidenceDrafts).where(and(eq(creatorEvidenceDrafts.id, input.id), eq(creatorEvidenceDrafts.userId, ctx.user.id)));
    return { success: true as const };
  }),
  clear: protectedProcedure.mutation(async ({ ctx }) => {
    await db.delete(creatorEvidenceDrafts).where(eq(creatorEvidenceDrafts.userId, ctx.user.id));
    return { success: true as const };
  }),
});
