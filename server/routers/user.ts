import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { follows, users } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, publicProcedure } from "../_core/trpc";

const profileInput = z
  .object({
    userId: z.union([z.string().min(1), z.number().int()]).optional(),
  })
  .optional();

function publicProfile(user: typeof users.$inferSelect, followerCount: number, email: string | null) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    avatar: user.avatar,
    verified: user.verified ?? false,
    createdAt: user.createdAt,
    email,
    followerCount,
    // These concepts are not represented by the current schema. Returning
    // null keeps clients honest instead of manufacturing progression metrics.
    level: null,
    xp: null,
    reputation: null,
  };
}

export const userProfileProcedure = publicProcedure
  .input(profileInput)
  .query(async ({ ctx, input }) => {
    const requestedId = input?.userId !== undefined ? String(input.userId) : ctx.user?.id;
    if (!requestedId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in or provide a userId" });
    }

    const user = await db.query.users.findFirst({ where: eq(users.id, requestedId) });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });
    }

    const followerRows = await db
      .select({ id: follows.id })
      .from(follows)
      .where(eq(follows.followingId, requestedId));

    const isOwnProfile = ctx.user?.id === requestedId;
    return publicProfile(user, followerRows.length, isOwnProfile ? user.email : null);
  });

const updateProfileInput = z
  .object({
    displayName: z.string().trim().min(1).max(255).optional(),
    name: z.string().trim().min(1).max(255).optional(),
    bio: z.string().trim().max(255).nullable().optional(),
    avatar: z.string().trim().max(255).nullable().optional(),
    username: z
      .string()
      .trim()
      .min(2)
      .max(64)
      .regex(/^[A-Za-z0-9_.-]+$/, "Username contains unsupported characters")
      .optional(),
  })
  .refine(value => Object.values(value).some(field => field !== undefined), {
    message: "At least one profile field is required",
  });

export const userUpdateProfileProcedure = protectedProcedure
  .input(updateProfileInput)
  .mutation(async ({ ctx, input }) => {
    const name = input.displayName ?? input.name;
    const updates: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updates.name = name;
    if (input.bio !== undefined) updates.bio = input.bio;
    if (input.avatar !== undefined) updates.avatar = input.avatar;
    if (input.username !== undefined) updates.username = input.username;

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
    if (!updated) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found after update" });
    }

    const followerRows = await db
      .select({ id: follows.id })
      .from(follows)
      .where(eq(follows.followingId, ctx.user.id));

    return publicProfile(updated, followerRows.length, updated.email);
  });
