import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { communities, communityMembers } from "../../drizzle/communitySchema";
import { users } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

export const communityRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(30) }).optional())
    .query(async ({ ctx, input }) => {
      const rows = await db
        .select({
          id: communities.id,
          ownerId: communities.ownerId,
          name: communities.name,
          description: communities.description,
          category: communities.category,
          visibility: communities.visibility,
          memberCount: communities.memberCount,
          createdAt: communities.createdAt,
          ownerName: users.name,
          ownerUsername: users.username,
        })
        .from(communities)
        .leftJoin(users, eq(communities.ownerId, users.id))
        .where(eq(communities.visibility, "public"))
        .orderBy(desc(communities.createdAt))
        .limit(input?.limit ?? 30);

      if (!ctx.user || !rows.length) {
        return rows.map(row => ({ ...row, joined: false }));
      }

      const memberships = await db
        .select({ communityId: communityMembers.communityId })
        .from(communityMembers)
        .where(eq(communityMembers.userId, ctx.user.id));
      const joinedIds = new Set(memberships.map(row => row.communityId));
      return rows.map(row => ({ ...row, joined: joinedIds.has(row.id) }));
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().trim().min(2).max(120),
      description: z.string().trim().max(255).nullable().optional(),
      category: z.string().trim().min(2).max(80).default("General"),
      visibility: z.enum(["public", "private"]).default("public"),
    }))
    .mutation(async ({ ctx, input }) => {
      const communityId = randomUUID();
      const memberId = randomUUID();
      await db.insert(communities).values({
        id: communityId,
        ownerId: ctx.user.id,
        name: input.name,
        description: input.description ?? null,
        category: input.category,
        visibility: input.visibility,
        memberCount: 1,
      });
      try {
        await db.insert(communityMembers).values({
          id: memberId,
          communityId,
          userId: ctx.user.id,
          role: "owner",
        });
      } catch (error) {
        await db.delete(communities).where(eq(communities.id, communityId));
        throw error;
      }
      return { id: communityId, joined: true, role: "owner" } as const;
    }),

  join: protectedProcedure
    .input(z.object({ communityId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const community = await db.query.communities?.findFirst?.({ where: eq(communities.id, input.communityId) })
        ?? (await db.select().from(communities).where(eq(communities.id, input.communityId)).limit(1))[0];
      if (!community) throw new TRPCError({ code: "NOT_FOUND", message: "Community not found" });

      const existing = (await db
        .select({ id: communityMembers.id })
        .from(communityMembers)
        .where(and(eq(communityMembers.communityId, input.communityId), eq(communityMembers.userId, ctx.user.id)))
        .limit(1))[0];
      if (existing) return { joined: true, created: false } as const;

      await db.insert(communityMembers).values({
        id: randomUUID(),
        communityId: input.communityId,
        userId: ctx.user.id,
        role: "member",
      });
      await db.update(communities)
        .set({ memberCount: sql`COALESCE(${communities.memberCount}, 0) + 1` })
        .where(eq(communities.id, input.communityId));
      return { joined: true, created: true } as const;
    }),

  leave: protectedProcedure
    .input(z.object({ communityId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const membership = (await db
        .select({ id: communityMembers.id, role: communityMembers.role })
        .from(communityMembers)
        .where(and(eq(communityMembers.communityId, input.communityId), eq(communityMembers.userId, ctx.user.id)))
        .limit(1))[0];
      if (!membership) return { joined: false, removed: false } as const;
      if (membership.role === "owner") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Community owner cannot leave without transferring or deleting the community" });
      }
      await db.delete(communityMembers).where(eq(communityMembers.id, membership.id));
      await db.update(communities)
        .set({ memberCount: sql`GREATEST(COALESCE(${communities.memberCount}, 1) - 1, 1)` })
        .where(eq(communities.id, input.communityId));
      return { joined: false, removed: true } as const;
    }),
});
