import { createHash } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { userBehaviorSignals } from "../../drizzle/schema";
import {
  BETA_GAME_SESSION_SIGNAL,
  betaGameIds,
  decodeBetaGameSession,
  encodeBetaGameSession,
  summarizeBetaGaming,
  type BetaGameSessionRecord,
} from "../_core/betaGaming";
import { protectedProcedure, router } from "../_core/trpc";
import { db } from "../db";

const gameId = z.enum(betaGameIds);
const mode = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .regex(/^[a-z0-9_-]+$/);

const runInput = z.object({
  runId: z.string().uuid(),
  gameId,
  mode,
  score: z.number().int().min(0).max(10_000_000),
  sparks: z.number().int().min(0).max(1_000_000),
  combo: z.number().int().min(0).max(1_000_000),
  durationMs: z.number().int().min(0).max(3_600_000),
});

function persistedRunId(userId: string, runId: string): string {
  const digest = createHash("sha256")
    .update(userId, "utf8")
    .update("\n", "utf8")
    .update(runId, "utf8")
    .digest("hex")
    .slice(0, 48);
  return `game-${digest}`;
}

async function loadSessions(
  userId: string,
  limit: number
): Promise<BetaGameSessionRecord[]> {
  const rows = await db
    .select({
      id: userBehaviorSignals.id,
      metadata: userBehaviorSignals.metadata,
      createdAt: userBehaviorSignals.createdAt,
    })
    .from(userBehaviorSignals)
    .where(
      and(
        eq(userBehaviorSignals.userId, userId),
        eq(userBehaviorSignals.signalType, BETA_GAME_SESSION_SIGNAL)
      )
    )
    .orderBy(desc(userBehaviorSignals.createdAt))
    .limit(limit);

  return rows.flatMap(row => {
    const decoded = decodeBetaGameSession(row.metadata);
    if (!decoded) return [];
    return [
      Object.freeze({
        id: row.id,
        ...decoded,
        createdAt: row.createdAt ?? new Date(0),
      }),
    ];
  });
}

export const betaGamingRouter = router({
  recordRun: protectedProcedure
    .input(runInput)
    .mutation(async ({ ctx, input }) => {
      const id = persistedRunId(ctx.user.id, input.runId);
      const existing = await db.query.userBehaviorSignals.findFirst({
        where: and(
          eq(userBehaviorSignals.id, id),
          eq(userBehaviorSignals.userId, ctx.user.id),
          eq(userBehaviorSignals.signalType, BETA_GAME_SESSION_SIGNAL)
        ),
      });

      const session = {
        runId: input.runId,
        gameId: input.gameId,
        mode: input.mode,
        score: input.score,
        sparks: input.sparks,
        combo: input.combo,
        durationMs: input.durationMs,
      } as const;

      if (existing) {
        return {
          created: false,
          session: {
            id: existing.id,
            ...session,
            createdAt: existing.createdAt ?? new Date(0),
          },
        } as const;
      }

      const metadata = encodeBetaGameSession(session);
      if (metadata.length > 255) {
        throw new Error("Beta game session metadata exceeds storage bound");
      }

      const createdAt = new Date();
      await db.insert(userBehaviorSignals).values({
        id,
        userId: ctx.user.id,
        signalType: BETA_GAME_SESSION_SIGNAL,
        value: input.score,
        metadata,
        createdAt,
      });

      return {
        created: true,
        session: {
          id,
          ...session,
          createdAt,
        },
      } as const;
    }),

  recent: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(50).default(12),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return loadSessions(ctx.user.id, input?.limit ?? 12);
    }),

  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const sessions = await loadSessions(ctx.user.id, 500);
    return {
      summary: summarizeBetaGaming(sessions),
      recent: sessions.slice(0, 12),
      historyLimit: 500,
      persistence:
        "Account-owned beta game sessions stored in the existing behavior-event table. Saving a run is explicit; anonymous game play is not written by this API.",
    } as const;
  }),
});
