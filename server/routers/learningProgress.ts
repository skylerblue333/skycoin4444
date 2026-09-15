import { randomUUID } from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { courseProgress } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const courseId = z.string().trim().min(1).max(120);
const lessonId = z.string().trim().min(1).max(120);

const progressSelection = {
  courseId: courseProgress.courseId,
  lessonId: courseProgress.lessonId,
  completedAt: courseProgress.completedAt,
} as const;

export const learningProgressRouter = router({
  get: protectedProcedure
    .input(z.object({ courseId }))
    .query(async ({ ctx, input }) => {
      return db
        .select(progressSelection)
        .from(courseProgress)
        .where(
          and(
            eq(courseProgress.userId, ctx.user.id),
            eq(courseProgress.courseId, input.courseId),
          ),
        )
        .orderBy(asc(courseProgress.lessonId));
    }),

  listAll: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select(progressSelection)
      .from(courseProgress)
      .where(eq(courseProgress.userId, ctx.user.id))
      .orderBy(asc(courseProgress.courseId), asc(courseProgress.lessonId));
  }),

  complete: protectedProcedure
    .input(z.object({ courseId, lessonId }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db
        .select({ id: courseProgress.id })
        .from(courseProgress)
        .where(
          and(
            eq(courseProgress.userId, ctx.user.id),
            eq(courseProgress.courseId, input.courseId),
            eq(courseProgress.lessonId, input.lessonId),
          ),
        )
        .limit(1);

      if (existing[0]) {
        return { completed: true, created: false } as const;
      }

      await db.insert(courseProgress).values({
        id: randomUUID(),
        userId: ctx.user.id,
        courseId: input.courseId,
        lessonId: input.lessonId,
      });

      return { completed: true, created: true } as const;
    }),
});
