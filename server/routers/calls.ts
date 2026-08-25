import { TRPCError } from "@trpc/server";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { callSessions } from "../../drizzle/callSchema";
import { notifications, users } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const callMode = z.enum(["voice", "video"]);
const callStatus = z.enum(["ringing", "accepted", "declined", "ended"]);

export const callsRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(30) }).optional())
    .query(async ({ ctx, input }) => {
      return db.select({
        id: callSessions.id,
        callerId: callSessions.callerId,
        calleeId: callSessions.calleeId,
        mode: callSessions.mode,
        status: callSessions.status,
        createdAt: callSessions.createdAt,
        answeredAt: callSessions.answeredAt,
        endedAt: callSessions.endedAt,
      }).from(callSessions)
        .where(or(eq(callSessions.callerId, ctx.user.id), eq(callSessions.calleeId, ctx.user.id)))
        .orderBy(desc(callSessions.createdAt))
        .limit(input?.limit ?? 30);
    }),

  invite: protectedProcedure
    .input(z.object({ calleeId: z.string().min(1), mode: callMode }))
    .mutation(async ({ ctx, input }) => {
      if (input.calleeId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "Calling yourself is not supported" });
      const callee = (await db.select({ id: users.id }).from(users).where(eq(users.id, input.calleeId)).limit(1))[0];
      if (!callee) throw new TRPCError({ code: "NOT_FOUND", message: "Call recipient not found" });
      const existing = (await db.select({ id: callSessions.id }).from(callSessions)
        .where(and(
          or(
            and(eq(callSessions.callerId, ctx.user.id), eq(callSessions.calleeId, input.calleeId)),
            and(eq(callSessions.callerId, input.calleeId), eq(callSessions.calleeId, ctx.user.id)),
          ),
          or(eq(callSessions.status, "ringing"), eq(callSessions.status, "accepted")),
        )).limit(1))[0];
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "An active call session already exists with this user" });

      const id = randomUUID();
      await db.insert(callSessions).values({ id, callerId: ctx.user.id, calleeId: input.calleeId, mode: input.mode, status: "ringing" });
      await db.insert(notifications).values({ id: randomUUID(), userId: input.calleeId, type: "call", content: `Incoming ${input.mode} call`, read: false });
      return { id, status: "ringing", mediaTransportReady: false } as const;
    }),

  respond: protectedProcedure
    .input(z.object({ callId: z.string().min(1), response: z.enum(["accept", "decline"]) }))
    .mutation(async ({ ctx, input }) => {
      const session = (await db.select({ id: callSessions.id, calleeId: callSessions.calleeId, status: callSessions.status }).from(callSessions).where(eq(callSessions.id, input.callId)).limit(1))[0];
      if (!session) throw new TRPCError({ code: "NOT_FOUND", message: "Call session not found" });
      if (session.calleeId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Only the recipient can answer this call" });
      if (session.status !== "ringing") throw new TRPCError({ code: "CONFLICT", message: "Call is no longer ringing" });
      const status = input.response === "accept" ? "accepted" : "declined";
      await db.update(callSessions).set({ status, answeredAt: input.response === "accept" ? sql`CURRENT_TIMESTAMP` : null, endedAt: input.response === "decline" ? sql`CURRENT_TIMESTAMP` : null }).where(eq(callSessions.id, input.callId));
      return { status, mediaTransportReady: false } as const;
    }),

  end: protectedProcedure
    .input(z.object({ callId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const session = (await db.select({ callerId: callSessions.callerId, calleeId: callSessions.calleeId, status: callSessions.status }).from(callSessions).where(eq(callSessions.id, input.callId)).limit(1))[0];
      if (!session) throw new TRPCError({ code: "NOT_FOUND", message: "Call session not found" });
      if (session.callerId !== ctx.user.id && session.calleeId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "You are not a participant in this call" });
      if (!callStatus.safeParse(session.status).success) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Call has an invalid stored status" });
      if (session.status === "ended" || session.status === "declined") return { status: session.status };
      await db.update(callSessions).set({ status: "ended", endedAt: sql`CURRENT_TIMESTAMP` }).where(eq(callSessions.id, input.callId));
      return { status: "ended" } as const;
    }),
});
