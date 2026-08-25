import { TRPCError } from "@trpc/server";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { messages, notifications, users } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const dmRouter = router({
  conversations: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const rows = await db
        .select({
          id: messages.id,
          senderId: messages.senderId,
          recipientId: messages.recipientId,
          content: messages.content,
          read: messages.read,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(or(eq(messages.senderId, ctx.user.id), eq(messages.recipientId, ctx.user.id)))
        .orderBy(desc(messages.createdAt))
        .limit(Math.min((input?.limit ?? 50) * 20, 1000));

      const partners = new Map<string, { partnerId: string; lastMessage: string | null; lastMessageAt: Date | null; unreadCount: number }>();
      for (const row of rows) {
        const partnerId = row.senderId === ctx.user.id ? row.recipientId : row.senderId;
        if (!partnerId) continue;
        const current = partners.get(partnerId);
        if (!current) {
          partners.set(partnerId, {
            partnerId,
            lastMessage: row.content,
            lastMessageAt: row.createdAt,
            unreadCount: row.recipientId === ctx.user.id && !row.read ? 1 : 0,
          });
        } else if (row.recipientId === ctx.user.id && !row.read) {
          current.unreadCount += 1;
        }
      }

      const limited = [...partners.values()].slice(0, input?.limit ?? 50);
      if (!limited.length) return [];
      const userRows = await db.select({ id: users.id, name: users.name, username: users.username, avatar: users.avatar, verified: users.verified }).from(users);
      const byId = new Map(userRows.map(user => [user.id, user]));
      return limited.map(conversation => ({ ...conversation, partner: byId.get(conversation.partnerId) ?? null }));
    }),

  messages: protectedProcedure
    .input(z.object({ userId: z.string().min(1), limit: z.number().int().min(1).max(200).default(100) }))
    .query(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "Direct messaging yourself is not supported" });
      return db
        .select({ id: messages.id, senderId: messages.senderId, recipientId: messages.recipientId, content: messages.content, read: messages.read, createdAt: messages.createdAt })
        .from(messages)
        .where(or(
          and(eq(messages.senderId, ctx.user.id), eq(messages.recipientId, input.userId)),
          and(eq(messages.senderId, input.userId), eq(messages.recipientId, ctx.user.id)),
        ))
        .orderBy(desc(messages.createdAt))
        .limit(input.limit);
    }),

  send: protectedProcedure
    .input(z.object({ recipientId: z.string().min(1), content: z.string().trim().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      if (input.recipientId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "Direct messaging yourself is not supported" });
      const recipient = (await db.select({ id: users.id }).from(users).where(eq(users.id, input.recipientId)).limit(1))[0];
      if (!recipient) throw new TRPCError({ code: "NOT_FOUND", message: "Recipient not found" });
      const id = randomUUID();
      await db.insert(messages).values({ id, senderId: ctx.user.id, recipientId: input.recipientId, content: input.content, read: false });
      await db.insert(notifications).values({ id: randomUUID(), userId: input.recipientId, type: "message", content: "You received a new direct message", read: false });
      return { id };
    }),

  markRead: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await db.update(messages)
        .set({ read: true })
        .where(and(eq(messages.senderId, input.userId), eq(messages.recipientId, ctx.user.id), eq(messages.read, false)));
      return { success: true } as const;
    }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db.select({ count: sql<number>`count(*)` }).from(messages).where(and(eq(messages.recipientId, ctx.user.id), eq(messages.read, false)));
    return { count: Number(rows[0]?.count ?? 0) };
  }),
});
