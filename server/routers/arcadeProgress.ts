import { randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { arcadeGameProgress } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const arcadeGameIdSchema = z.enum([
  "sky-rush",
  "crypto-quiz",
  "spark-tap",
  "block-builder",
  "blackjack-lab",
  "crash-lab",
  "pattern-lab",
]);

export const arcadeRunInputSchema = z.object({
  gameId: arcadeGameIdSchema,
  score: z.number().int().min(0).max(10_000_000),
  sparks: z.number().int().min(0).max(100_000).default(0),
  xp: z.number().int().min(0).max(1_000_000).default(0),
  combo: z.number().int().min(0).max(100_000).default(0),
});

async function findUserGame(userId: string, gameId: string) {
  const rows = await db
    .select({
      gameId: arcadeGameProgress.gameId,
      plays: arcadeGameProgress.plays,
      bestScore: arcadeGameProgress.bestScore,
      bestCombo: arcadeGameProgress.bestCombo,
      totalSparks: arcadeGameProgress.totalSparks,
      totalXp: arcadeGameProgress.totalXp,
      lastPlayedAt: arcadeGameProgress.lastPlayedAt,
      updatedAt: arcadeGameProgress.updatedAt,
    })
    .from(arcadeGameProgress)
    .where(
      and(
        eq(arcadeGameProgress.userId, userId),
        eq(arcadeGameProgress.gameId, gameId)
      )
    )
    .limit(1);

  return rows[0] ?? null;
}

export const arcadeProgressRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select({
        gameId: arcadeGameProgress.gameId,
        plays: arcadeGameProgress.plays,
        bestScore: arcadeGameProgress.bestScore,
        bestCombo: arcadeGameProgress.bestCombo,
        totalSparks: arcadeGameProgress.totalSparks,
        totalXp: arcadeGameProgress.totalXp,
        lastPlayedAt: arcadeGameProgress.lastPlayedAt,
        updatedAt: arcadeGameProgress.updatedAt,
      })
      .from(arcadeGameProgress)
      .where(eq(arcadeGameProgress.userId, ctx.user.id))
      .orderBy(desc(arcadeGameProgress.updatedAt));
  }),

  record: protectedProcedure
    .input(arcadeRunInputSchema)
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      await db
        .insert(arcadeGameProgress)
        .values({
          id: randomUUID(),
          userId: ctx.user.id,
          gameId: input.gameId,
          plays: 1,
          bestScore: input.score,
          bestCombo: input.combo,
          totalSparks: input.sparks,
          totalXp: input.xp,
          lastPlayedAt: now,
          updatedAt: now,
        })
        .onDuplicateKeyUpdate({
          set: {
            plays: sql`${arcadeGameProgress.plays} + 1`,
            bestScore: sql`GREATEST(${arcadeGameProgress.bestScore}, ${input.score})`,
            bestCombo: sql`GREATEST(${arcadeGameProgress.bestCombo}, ${input.combo})`,
            totalSparks: sql`${arcadeGameProgress.totalSparks} + ${input.sparks}`,
            totalXp: sql`${arcadeGameProgress.totalXp} + ${input.xp}`,
            lastPlayedAt: now,
            updatedAt: now,
          },
        });

      const saved = await findUserGame(ctx.user.id, input.gameId);
      if (!saved) {
        throw new Error("Arcade progress record was not readable after write");
      }

      return {
        ...saved,
        authoritativeLeaderboard: false as const,
        financialValue: false as const,
      };
    }),
});
