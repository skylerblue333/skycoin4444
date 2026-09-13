import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { liveRoomRegistry } from "../features/live-rooms";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const roomId = z.string().uuid();
const peerId = z.string().uuid();
const sequence = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);

function translateRegistryError(error: unknown): never {
  if (!(error instanceof Error)) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Live room operation failed" });
  }

  const message = error.message;
  const code = message.includes("not found")
    ? "NOT_FOUND"
    : message.startsWith("only the host") || message.includes("participant session")
      ? "FORBIDDEN"
      : message.includes("capacity") || message.includes("already has") || message.includes("has ended")
        ? "CONFLICT"
        : "BAD_REQUEST";
  throw new TRPCError({ code, message });
}

function run<T>(operation: () => T): T {
  try {
    return operation();
  } catch (error) {
    return translateRegistryError(error);
  }
}

export const liveRoomsRouter = router({
  list: publicProcedure.query(() => liveRoomRegistry.list()),

  get: publicProcedure
    .input(z.object({ roomId }))
    .query(({ input }) => run(() => liveRoomRegistry.get(input.roomId))),

  create: protectedProcedure
    .input(z.object({
      title: z.string().trim().min(1).max(100),
      category: z.string().trim().min(1).max(40),
    }))
    .mutation(({ ctx, input }) => run(() => liveRoomRegistry.create(ctx.user.id, input.title, input.category))),

  hostSession: protectedProcedure
    .input(z.object({ roomId }))
    .mutation(({ ctx, input }) => run(() => liveRoomRegistry.hostSession(input.roomId, ctx.user.id))),

  join: protectedProcedure
    .input(z.object({ roomId }))
    .mutation(({ ctx, input }) => run(() => liveRoomRegistry.join(input.roomId, ctx.user.id))),

  heartbeat: protectedProcedure
    .input(z.object({ roomId, peerId }))
    .mutation(({ ctx, input }) => run(() => liveRoomRegistry.heartbeat(input.roomId, ctx.user.id, input.peerId))),

  end: protectedProcedure
    .input(z.object({ roomId }))
    .mutation(({ ctx, input }) => run(() => liveRoomRegistry.end(input.roomId, ctx.user.id))),

  sendSignal: protectedProcedure
    .input(z.object({
      roomId,
      fromPeerId: peerId,
      toPeerId: peerId,
      kind: z.enum(["ready", "offer", "answer", "ice"]),
      payload: z.string().max(24_000),
    }))
    .mutation(({ ctx, input }) => run(() => liveRoomRegistry.sendSignal(
      input.roomId,
      ctx.user.id,
      input.fromPeerId,
      input.toPeerId,
      input.kind,
      input.payload,
    ))),

  signals: protectedProcedure
    .input(z.object({ roomId, peerId, afterSequence: sequence.default(0) }))
    .query(({ ctx, input }) => run(() => liveRoomRegistry.pollSignals(
      input.roomId,
      ctx.user.id,
      input.peerId,
      input.afterSequence,
    ))),

  sendChat: protectedProcedure
    .input(z.object({ roomId, peerId, message: z.string().trim().min(1).max(500) }))
    .mutation(({ ctx, input }) => run(() => liveRoomRegistry.sendChat(
      input.roomId,
      ctx.user.id,
      input.peerId,
      input.message,
    ))),

  chat: protectedProcedure
    .input(z.object({ roomId, peerId, afterSequence: sequence.default(0) }))
    .query(({ ctx, input }) => run(() => liveRoomRegistry.listChat(
      input.roomId,
      ctx.user.id,
      input.peerId,
      input.afterSequence,
    ))),

  deleteChat: protectedProcedure
    .input(z.object({ roomId, messageId: z.string().uuid() }))
    .mutation(({ ctx, input }) => run(() => liveRoomRegistry.deleteChat(input.roomId, ctx.user.id, input.messageId))),
});
