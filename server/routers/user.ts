import { TRPCError } from "@trpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { eventOutbox, follows, notifications, users } from "../../drizzle/schema";
import {
  createDomainEvent,
  toOutboxRow,
} from "../../packages/event-fabric/src/index";
import { db } from "../db";
import { protectedProcedure, publicProcedure } from "../_core/trpc";
import { isMysqlDuplicateEntryFor } from "../_core/dbErrors";

const userIdSchema = z.union([z.string().min(1), z.number().int()]);
const profileInput = z.object({ userId: userIdSchema.optional() }).optional();
const listInput = z
  .object({
    userId: userIdSchema.optional(),
    limit: z.number().int().min(1).max(100).default(30),
  })
  .optional();

const publicUserFields = {
  id: users.id,
  username: users.username,
  name: users.name,
  bio: users.bio,
  avatar: users.avatar,
  verified: users.verified,
  createdAt: users.createdAt,
};

export function publicProfile(user: typeof users.$inferSelect, followerCount: number, viewerId?: string) {
  const isOwnProfile = viewerId === user.id;
  const isRedacted = user.profileVisibility === "private" && !isOwnProfile;
  return {
    id: user.id,
    username: isRedacted ? null : user.username,
    name: isRedacted ? null : user.name,
    bio: isRedacted ? null : user.bio,
    avatar: isRedacted ? null : user.avatar,
    verified: user.verified ?? false,
    createdAt: user.createdAt,
    email: isOwnProfile ? user.email : null,
    profileVisibility: user.profileVisibility,
    followerCount: isRedacted ? 0 : followerCount,
    level: null,
    xp: null,
    reputation: null,
  };
}

function resolveTargetId(input: { userId?: string | number } | undefined, sessionUserId?: string) {
  const requestedId = input?.userId !== undefined ? String(input.userId) : sessionUserId;
  if (!requestedId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in or provide a userId" });
  }
  return requestedId;
}

export const userProfileProcedure = publicProcedure
  .input(profileInput)
  .query(async ({ ctx, input }) => {
    const requestedId = resolveTargetId(input, ctx.user?.id);
    const user = await db.query.users.findFirst({ where: eq(users.id, requestedId) });
    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });

    const followerRows = await db
      .select({ id: follows.id })
      .from(follows)
      .where(eq(follows.followingId, requestedId));

    return publicProfile(user, followerRows.length, ctx.user?.id);
  });

const updateProfileInput = z
  .object({
    displayName: z.string().trim().min(1).max(255).optional(),
    name: z.string().trim().min(1).max(255).optional(),
    bio: z.string().trim().max(255).nullable().optional(),
    avatar: z.string().trim().max(255).nullable().optional(),
    profileVisibility: z.enum(["public", "members", "private"]).optional(),
    username: z.string().trim().min(2).max(64).regex(/^[A-Za-z0-9_.-]+$/, "Username contains unsupported characters").optional(),
  })
  .refine(value => Object.values(value).some(field => field !== undefined), {
    message: "At least one profile field is required",
  });

export const userUpdateProfileProcedure = protectedProcedure
  .input(updateProfileInput)
  .mutation(async ({ ctx, input }) => {
    const name = input.displayName ?? input.name;
    const updates: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
    if (name !== undefined) updates.name = name;
    if (input.bio !== undefined) updates.bio = input.bio;
    if (input.avatar !== undefined) updates.avatar = input.avatar;
    if (input.username !== undefined) updates.username = input.username;
    if (input.profileVisibility !== undefined) updates.profileVisibility = input.profileVisibility;

    try {
      await db.update(users).set(updates).where(eq(users.id, ctx.user.id));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.toLowerCase().includes("duplicate")) {
        throw new TRPCError({ code: "CONFLICT", message: "Username is already in use" });
      }
      throw error;
    }

    const updated = await db.query.users.findFirst({ where: eq(users.id, ctx.user.id) });
    if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found after update" });

    const followerRows = await db.select({ id: follows.id }).from(follows).where(eq(follows.followingId, ctx.user.id));
    return publicProfile(updated, followerRows.length, ctx.user.id);
  });

export const userFollowersProcedure = publicProcedure
  .input(listInput)
  .query(async ({ ctx, input }) => {
    const targetId = resolveTargetId(input, ctx.user?.id);
    const limit = input?.limit ?? 30;
    const rows = await db
      .select({ userId: follows.followerId })
      .from(follows)
      .where(eq(follows.followingId, targetId))
      .limit(limit);
    const ids = rows.map(row => row.userId).filter((id): id is string => Boolean(id));
    if (!ids.length) return [];
    return db.select(publicUserFields).from(users).where(inArray(users.id, ids)).limit(limit);
  });

export const userFollowingProcedure = publicProcedure
  .input(listInput)
  .query(async ({ ctx, input }) => {
    const targetId = resolveTargetId(input, ctx.user?.id);
    const limit = input?.limit ?? 30;
    const rows = await db
      .select({ userId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, targetId))
      .limit(limit);
    const ids = rows.map(row => row.userId).filter((id): id is string => Boolean(id));
    if (!ids.length) return [];
    return db.select(publicUserFields).from(users).where(inArray(users.id, ids)).limit(limit);
  });

export const userSuggestedFollowsProcedure = protectedProcedure
  .input(z.object({ limit: z.number().int().min(1).max(50).default(12) }).optional())
  .query(async ({ ctx, input }) => {
    const existing = await db
      .select({ userId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, ctx.user.id));
    const excluded = new Set(existing.map(row => row.userId).filter(Boolean));
    excluded.add(ctx.user.id);

    const candidates = await db.select(publicUserFields).from(users).limit(100);
    return candidates.filter(candidate => !excluded.has(candidate.id)).slice(0, input?.limit ?? 12);
  });

export const userFollowProcedure = protectedProcedure
  .input(z.object({ userId: userIdSchema }))
  .mutation(async ({ ctx, input }) => {
    const targetId = String(input.userId);
    if (targetId === ctx.user.id) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot follow yourself" });
    }

    const target = await db.query.users.findFirst({ where: eq(users.id, targetId) });
    if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

    const existing = await db.query.follows.findFirst({
      where: and(eq(follows.followerId, ctx.user.id), eq(follows.followingId, targetId)),
    });
    if (existing) return { following: true, created: false } as const;

    const followId = randomUUID();
    const event = createDomainEvent({
      eventType: "social.follow.created",
      schemaVersion: 1,
      producer: "skycoin4444.social",
      aggregate: { type: "social.follow", id: followId },
      correlationId: ctx.requestId,
      actorId: ctx.user.id,
      payload: {
        followId,
        followerId: ctx.user.id,
        followingId: targetId,
      },
      metadata: { source: "trpc" },
    });

    try {
      await db.transaction(async tx => {
        await tx.insert(follows).values({
          id: followId,
          followerId: ctx.user.id,
          followingId: targetId,
        });

        await tx.insert(notifications).values({
          id: randomUUID(),
          userId: targetId,
          type: "follow",
          content: `${ctx.user.name || ctx.user.username || "Someone"} followed you`,
          read: false,
        });

        await tx.insert(eventOutbox).values(toOutboxRow(event));
      });
    } catch (error) {
      if (
        isMysqlDuplicateEntryFor(
          error,
          "follows_follower_following_unique"
        )
      ) {
        return { following: true, created: false } as const;
      }
      throw error;
    }

    return { following: true, created: true } as const;
  });

export const userUnfollowProcedure = protectedProcedure
  .input(z.object({ userId: userIdSchema }))
  .mutation(async ({ ctx, input }) => {
    const targetId = String(input.userId);
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, ctx.user.id), eq(follows.followingId, targetId)));
    return { following: false } as const;
  });
