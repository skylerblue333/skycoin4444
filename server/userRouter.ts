import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "./db";
import * as schema from "../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

type PersistedUser = typeof schema.users.$inferSelect;

type ProfileUpdate = {
  name?: string;
  username?: string;
  bio?: string | null;
  avatar?: string | null;
};

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(32, "Username must be 32 characters or fewer.")
  .regex(
    /^[a-z0-9_]+$/,
    "Use lowercase letters, numbers, and underscores only."
  );

const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    username: usernameSchema.optional(),
    bio: z.string().trim().max(255).nullable().optional(),
    avatar: z.string().trim().max(255).nullable().optional(),
  })
  .refine(
    input => Object.values(input).some(value => value !== undefined),
    "Provide at least one profile field to update."
  );

function toPublicProfile(user: PersistedUser) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
    verified: user.verified,
    createdAt: user.createdAt,
  };
}

async function findUserById(id: string): Promise<PersistedUser> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }

    return user;
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to load the user profile.",
      cause: error,
    });
  }
}

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await findUserById(ctx.user.id);
    return toPublicProfile(user);
  }),

  profileByUsername: publicProcedure
    .input(z.object({ username: usernameSchema }))
    .query(async ({ input }) => {
      try {
        const user = await db.query.users.findFirst({
          where: eq(schema.users.username, input.username),
        });

        return user ? toPublicProfile(user) : null;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to load the requested profile.",
          cause: error,
        });
      }
    }),

  updateProfile: protectedProcedure
    .input(profileUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const currentUser = await findUserById(ctx.user.id);
      const update: ProfileUpdate = {};

      if (input.name !== undefined) {
        update.name = input.name;
      }
      if (input.bio !== undefined) {
        update.bio = input.bio || null;
      }
      if (input.avatar !== undefined) {
        update.avatar = input.avatar || null;
      }
      if (input.username !== undefined) {
        const usernameOwner = await db.query.users.findFirst({
          where: eq(schema.users.username, input.username),
        });

        if (usernameOwner && usernameOwner.id !== currentUser.id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "That username is already in use.",
          });
        }
        update.username = input.username;
      }

      try {
        await db
          .update(schema.users)
          .set(update)
          .where(eq(schema.users.id, currentUser.id));

        const updatedUser = await findUserById(currentUser.id);
        return toPublicProfile(updatedUser);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to update the user profile.",
          cause: error,
        });
      }
    }),
});
