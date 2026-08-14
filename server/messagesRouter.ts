import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import * as schema from "../drizzle/schema";
import { db } from "./db";
import { protectedProcedure, router } from "./_core/trpc";

const participantInput = z.object({
  participantId: z.string().trim().min(1).max(255),
});

const messageInput = z
  .object({
    recipientId: z.string().trim().min(1).max(255).optional(),
    recipientUsername: z.string().trim().min(1).max(255).optional(),
    content: z.string().trim().min(1).max(255),
  })
  .refine(input => Boolean(input.recipientId || input.recipientUsername), {
    message: "Provide a recipient ID or username.",
  });

function messagePairCondition(userId: string, participantId: string) {
  return or(
    and(
      eq(schema.messages.senderId, userId),
      eq(schema.messages.recipientId, participantId)
    ),
    and(
      eq(schema.messages.senderId, participantId),
      eq(schema.messages.recipientId, userId)
    )
  );
}

export const messagesRouter = router({
  inbox: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.user.id;
      const messages = await db.query.messages.findMany({
        where: or(
          eq(schema.messages.senderId, userId),
          eq(schema.messages.recipientId, userId)
        ),
        orderBy: desc(schema.messages.createdAt),
        limit: 200,
      });

      const latestByParticipant = new Map<string, (typeof messages)[number]>();
      const unreadByParticipant = new Map<string, number>();

      for (const message of messages) {
        const participantId =
          message.senderId === userId ? message.recipientId : message.senderId;
        if (!participantId) continue;

        if (!latestByParticipant.has(participantId)) {
          latestByParticipant.set(participantId, message);
        }
        if (message.recipientId === userId && !message.read) {
          unreadByParticipant.set(
            participantId,
            (unreadByParticipant.get(participantId) ?? 0) + 1
          );
        }
      }

      const participantIds = [...latestByParticipant.keys()];
      if (participantIds.length === 0) return [];

      const participants = await db.query.users.findMany({
        where: inArray(schema.users.id, participantIds),
        columns: { id: true, username: true, name: true, avatar: true },
      });
      const participantById = new Map(
        participants.map(participant => [participant.id, participant])
      );

      return participantIds
        .map(participantId => {
          const participant = participantById.get(participantId);
          const latestMessage = latestByParticipant.get(participantId);
          if (!participant || !latestMessage) return null;
          return {
            participant,
            lastMessage: latestMessage.content,
            lastMessageAt: latestMessage.createdAt,
            unreadCount: unreadByParticipant.get(participantId) ?? 0,
          };
        })
        .filter(
          (conversation): conversation is NonNullable<typeof conversation> =>
            conversation !== null
        );
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to load message conversations.",
        cause: error,
      });
    }
  }),

  thread: protectedProcedure
    .input(participantInput)
    .query(async ({ ctx, input }) => {
      if (input.participantId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choose another participant.",
        });
      }

      try {
        return await db.query.messages.findMany({
          where: messagePairCondition(ctx.user.id, input.participantId),
          orderBy: asc(schema.messages.createdAt),
          limit: 200,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to load this message thread.",
          cause: error,
        });
      }
    }),

  send: protectedProcedure
    .input(messageInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const recipient = await db.query.users.findFirst({
          where: input.recipientId
            ? eq(schema.users.id, input.recipientId)
            : eq(schema.users.username, input.recipientUsername!),
          columns: { id: true, username: true, name: true, avatar: true },
        });
        if (!recipient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Recipient username was not found.",
          });
        }
        if (recipient.id === ctx.user.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You cannot message your own account.",
          });
        }

        const id = randomUUID();
        await db.insert(schema.messages).values({
          id,
          senderId: ctx.user.id,
          recipientId: recipient.id,
          content: input.content,
          read: false,
        });

        return { id, recipient };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to send the message.",
          cause: error,
        });
      }
    }),

  markThreadRead: protectedProcedure
    .input(participantInput)
    .mutation(async ({ ctx, input }) => {
      if (input.participantId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choose another participant.",
        });
      }

      try {
        await db
          .update(schema.messages)
          .set({ read: true })
          .where(
            and(
              eq(schema.messages.senderId, input.participantId),
              eq(schema.messages.recipientId, ctx.user.id),
              eq(schema.messages.read, false)
            )
          );
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to mark messages as read.",
          cause: error,
        });
      }
    }),

  deleteOwn: protectedProcedure
    .input(z.object({ messageId: z.string().trim().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const message = await db.query.messages.findFirst({
          where: eq(schema.messages.id, input.messageId),
          columns: { id: true, senderId: true },
        });
        if (!message) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Message not found.",
          });
        }
        if (message.senderId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only delete your own messages.",
          });
        }

        await db
          .delete(schema.messages)
          .where(eq(schema.messages.id, input.messageId));
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete the message.",
          cause: error,
        });
      }
    }),
});
