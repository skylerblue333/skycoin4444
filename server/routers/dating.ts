import { TRPCError } from "@trpc/server";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  lte,
  ne,
  or,
} from "drizzle-orm";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import {
  datingBlocks,
  datingLikes,
  datingMatches,
  datingMessages,
  datingNotifications,
  datingPreferences,
  datingProfiles,
  datingReports,
  datingSubscriptions,
  users,
} from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

const relationshipIntent = z.enum([
  "relationship",
  "casual",
  "friendship",
  "networking",
]);

const profileGender = z.enum([
  "man",
  "woman",
  "nonbinary",
  "other",
  "prefer-not-to-say",
]);

const genderPreference = z.enum(["men", "women", "everyone"]);

const profileInput = z.object({
  bio: z.string().trim().min(10).max(255),
  interests: z
    .array(z.string().trim().min(1).max(24))
    .min(1)
    .max(8),
  location: z.string().trim().min(2).max(120),
  age: z.number().int().min(18).max(120),
  gender: profileGender.nullable().optional(),
  lookingFor: relationshipIntent,
});

const minAgeSchema = z.number().int().min(18).max(120);
const maxAgeSchema = z.number().int().min(18).max(120);

export const datingPreferencesInputSchema = z
  .object({
    minAge: minAgeSchema,
    maxAge: maxAgeSchema,
    genderPreference: genderPreference.nullable().optional(),
  })
  .refine(value => value.maxAge >= value.minAge, {
    message: "Maximum age must be greater than or equal to minimum age",
    path: ["maxAge"],
  });

export const datingDiscoveryInputSchema = z.object({
  minAge: minAgeSchema.optional(),
  maxAge: maxAgeSchema.optional(),
  genderPreference: genderPreference.nullable().optional(),
  location: z.string().trim().max(120).optional(),
  interest: z.string().trim().max(24).optional(),
  limit: z.number().int().min(1).max(50).default(25),
});

export const datingActionInputSchema = z.object({
  profileUserId: z.string().trim().min(1).max(255),
  action: z.enum(["like", "superlike", "pass"]),
});

const reportReason = z.enum([
  "fake_profile",
  "harassment",
  "scam_money",
  "underage_concern",
  "unsafe_behavior",
  "other",
]);

type ConnectionProfile = {
  location: string | null;
  interests: string | null;
};

type PairMatch = typeof datingMatches.$inferSelect;

function canonicalDatingPair(userA: string, userB: string) {
  const [userId1, userId2] = [userA, userB].sort();
  const digest = createHash("sha256")
    .update(userId1)
    .update("\0")
    .update(userId2)
    .digest("hex");
  return {
    id: `dating-pair-${digest}`,
    userId1,
    userId2,
  };
}

function matchNotificationId(matchId: string, userId: string) {
  return `dating-match-notification-${createHash("sha256")
    .update(matchId)
    .update("\0")
    .update(userId)
    .digest("hex")}`;
}

async function insertDatingNotificationOnce(input: {
  id: string;
  userId: string;
  type: string;
  relatedUserId: string | null;
}) {
  try {
    await db.insert(datingNotifications).values({
      ...input,
      read: false,
    });
  } catch (error) {
    const existing = (
      await db
        .select({ id: datingNotifications.id })
        .from(datingNotifications)
        .where(eq(datingNotifications.id, input.id))
        .limit(1)
    )[0];
    if (!existing) throw error;
  }
}

async function activateMutualMatch(
  userA: string,
  userB: string,
  knownPair?: PairMatch
) {
  if (knownPair) {
    if (knownPair.status === "matched") {
      return { matchId: knownPair.id, becameMatch: false };
    }
    await db
      .update(datingMatches)
      .set({ status: "matched" })
      .where(eq(datingMatches.id, knownPair.id));
    return { matchId: knownPair.id, becameMatch: true };
  }

  const canonical = canonicalDatingPair(userA, userB);
  try {
    await db.insert(datingMatches).values({
      ...canonical,
      status: "matched",
    });
    return { matchId: canonical.id, becameMatch: true };
  } catch (error) {
    const existing = (
      await db
        .select()
        .from(datingMatches)
        .where(eq(datingMatches.id, canonical.id))
        .limit(1)
    )[0];
    if (!existing) throw error;

    const becameMatch = existing.status !== "matched";
    if (becameMatch) {
      await db
        .update(datingMatches)
        .set({ status: "matched" })
        .where(eq(datingMatches.id, existing.id));
    }
    return { matchId: existing.id, becameMatch };
  }
}

async function rejectDatingPair(
  userA: string,
  userB: string,
  knownPair?: PairMatch
) {
  if (knownPair) {
    if (knownPair.status === "matched") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Use unmatch or block for an active match",
      });
    }
    await db
      .update(datingMatches)
      .set({ status: "rejected" })
      .where(eq(datingMatches.id, knownPair.id));
    return knownPair.id;
  }

  const canonical = canonicalDatingPair(userA, userB);
  try {
    await db.insert(datingMatches).values({
      ...canonical,
      status: "rejected",
    });
    return canonical.id;
  } catch (error) {
    const existing = (
      await db
        .select()
        .from(datingMatches)
        .where(eq(datingMatches.id, canonical.id))
        .limit(1)
    )[0];
    if (!existing) throw error;
    if (existing.status === "matched") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Use unmatch or block for an active match",
      });
    }
    await db
      .update(datingMatches)
      .set({ status: "rejected" })
      .where(eq(datingMatches.id, existing.id));
    return existing.id;
  }
}

export function parseDatingInterests(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map(item => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  } catch {
    return [];
  }
}

function serializeDatingInterests(interests: string[]): string {
  const normalized = Array.from(
    new Map(
      interests
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => [item.toLocaleLowerCase(), item] as const)
    ).values()
  ).slice(0, 8);
  const serialized = JSON.stringify(normalized);
  if (serialized.length > 255) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Interest list is too long to store safely",
    });
  }
  return serialized;
}

function locationParts(value: string | null): string[] {
  return (value ?? "")
    .split(",")
    .map(part => part.trim().toLocaleLowerCase())
    .filter(Boolean);
}

export function sameGeneralDatingLocation(
  left: string | null,
  right: string | null
): boolean {
  const a = locationParts(left);
  const b = locationParts(right);
  return a.length > 0 && b.length > 0 && a.some(part => b.includes(part));
}

export function buildDatingConnectionEvidence(
  viewer: ConnectionProfile | null,
  candidate: ConnectionProfile
) {
  if (!viewer) {
    return {
      sharedInterests: [] as string[],
      sameGeneralLocation: false,
      sharedSignalCount: 0,
    };
  }

  const viewerInterests = new Set(
    parseDatingInterests(viewer.interests).map(item =>
      item.toLocaleLowerCase()
    )
  );
  const sharedInterests = parseDatingInterests(candidate.interests).filter(
    item => viewerInterests.has(item.toLocaleLowerCase())
  );
  const sameGeneralLocation = sameGeneralDatingLocation(
    viewer.location,
    candidate.location
  );

  return {
    sharedInterests,
    sameGeneralLocation,
    sharedSignalCount:
      sharedInterests.length + (sameGeneralLocation ? 1 : 0),
  };
}

async function findPairMatch(userA: string, userB: string) {
  return (
    await db
      .select()
      .from(datingMatches)
      .where(
        or(
          and(
            eq(datingMatches.userId1, userA),
            eq(datingMatches.userId2, userB)
          ),
          and(
            eq(datingMatches.userId1, userB),
            eq(datingMatches.userId2, userA)
          )
        )
      )
      .limit(1)
  )[0];
}

async function assertAdultDatingTarget(targetUserId: string) {
  const target = (
    await db
      .select({
        userId: datingProfiles.userId,
        age: datingProfiles.age,
      })
      .from(datingProfiles)
      .where(eq(datingProfiles.userId, targetUserId))
      .limit(1)
  )[0];

  if (!target) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Dating profile not found",
    });
  }
  if (typeof target.age !== "number" || target.age < 18) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Dating is restricted to adult profiles",
    });
  }
}

async function pairIsBlocked(userA: string, userB: string) {
  const row = (
    await db
      .select({ id: datingBlocks.id })
      .from(datingBlocks)
      .where(
        or(
          and(
            eq(datingBlocks.userId, userA),
            eq(datingBlocks.blockedUserId, userB)
          ),
          and(
            eq(datingBlocks.userId, userB),
            eq(datingBlocks.blockedUserId, userA)
          )
        )
      )
      .limit(1)
  )[0];
  return Boolean(row);
}

async function blockPair(userId: string, blockedUserId: string, reason?: string) {
  const existing = (
    await db
      .select({ id: datingBlocks.id })
      .from(datingBlocks)
      .where(
        and(
          eq(datingBlocks.userId, userId),
          eq(datingBlocks.blockedUserId, blockedUserId)
        )
      )
      .limit(1)
  )[0];

  if (!existing) {
    await db.insert(datingBlocks).values({
      id: randomUUID(),
      userId,
      blockedUserId,
      reason: reason?.slice(0, 255) ?? null,
    });
  }

  await db
    .delete(datingLikes)
    .where(
      or(
        and(
          eq(datingLikes.userId, userId),
          eq(datingLikes.likedUserId, blockedUserId)
        ),
        and(
          eq(datingLikes.userId, blockedUserId),
          eq(datingLikes.likedUserId, userId)
        )
      )
    );

  const pair = await findPairMatch(userId, blockedUserId);
  if (pair) {
    await db
      .update(datingMatches)
      .set({ status: "rejected" })
      .where(eq(datingMatches.id, pair.id));
  }

  return { blocked: true as const, created: !existing };
}

async function requireMatchedConversation(matchId: string, userId: string) {
  const match = (
    await db
      .select()
      .from(datingMatches)
      .where(eq(datingMatches.id, matchId))
      .limit(1)
  )[0];

  if (!match) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Match not found" });
  }
  if (match.userId1 !== userId && match.userId2 !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not part of this match",
    });
  }
  if (match.status !== "matched") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Messaging is available only for active mutual matches",
    });
  }

  const otherUserId =
    match.userId1 === userId ? match.userId2 : match.userId1;
  if (await pairIsBlocked(userId, otherUserId)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Messaging is unavailable for blocked profiles",
    });
  }

  return { match, otherUserId };
}

export const datingRouter = router({
  profile: protectedProcedure.query(async ({ ctx }) => {
    const row = (
      await db
        .select({
          id: datingProfiles.id,
          userId: datingProfiles.userId,
          bio: datingProfiles.bio,
          interests: datingProfiles.interests,
          location: datingProfiles.location,
          age: datingProfiles.age,
          gender: datingProfiles.gender,
          lookingFor: datingProfiles.lookingFor,
          createdAt: datingProfiles.createdAt,
          displayName: users.name,
          username: users.username,
          avatar: users.avatar,
        })
        .from(datingProfiles)
        .leftJoin(users, eq(datingProfiles.userId, users.id))
        .where(eq(datingProfiles.userId, ctx.user.id))
        .limit(1)
    )[0];

    if (!row) return null;
    return {
      ...row,
      interests: parseDatingInterests(row.interests),
      verification:
        "No identity, age-document, background-check, or safety verification is claimed.",
    };
  }),

  upsertProfile: protectedProcedure
    .input(profileInput)
    .mutation(async ({ ctx, input }) => {
      const interests = serializeDatingInterests(input.interests);
      const existing = (
        await db
          .select({ id: datingProfiles.id })
          .from(datingProfiles)
          .where(eq(datingProfiles.userId, ctx.user.id))
          .limit(1)
      )[0];

      if (existing) {
        await db
          .update(datingProfiles)
          .set({
            bio: input.bio,
            interests,
            location: input.location,
            age: input.age,
            gender: input.gender ?? null,
            lookingFor: input.lookingFor,
          })
          .where(eq(datingProfiles.id, existing.id));
        return { id: existing.id, created: false as const };
      }

      const id = randomUUID();
      await db.insert(datingProfiles).values({
        id,
        userId: ctx.user.id,
        bio: input.bio,
        interests,
        location: input.location,
        age: input.age,
        gender: input.gender ?? null,
        lookingFor: input.lookingFor,
        verified: false,
      });

      return { id, created: true as const };
    }),

  preferences: protectedProcedure.query(async ({ ctx }) => {
    const row = (
      await db
        .select()
        .from(datingPreferences)
        .where(eq(datingPreferences.userId, ctx.user.id))
        .limit(1)
    )[0];

    return {
      minAge: row?.minAge ?? 18,
      maxAge: row?.maxAge ?? 65,
      genderPreference:
        row?.genderPreference === "men" ||
        row?.genderPreference === "women" ||
        row?.genderPreference === "everyone"
          ? row.genderPreference
          : "everyone",
      distanceFilteringAvailable: false,
      note:
        "Distance is not applied because precise geolocation is not part of the current dating beta.",
    };
  }),

  savePreferences: protectedProcedure
    .input(datingPreferencesInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = (
        await db
          .select({ id: datingPreferences.id })
          .from(datingPreferences)
          .where(eq(datingPreferences.userId, ctx.user.id))
          .limit(1)
      )[0];

      if (existing) {
        await db
          .update(datingPreferences)
          .set({
            minAge: input.minAge,
            maxAge: input.maxAge,
            genderPreference: input.genderPreference ?? "everyone",
          })
          .where(eq(datingPreferences.id, existing.id));
        return { saved: true as const, created: false as const };
      }

      await db.insert(datingPreferences).values({
        id: randomUUID(),
        userId: ctx.user.id,
        minAge: input.minAge,
        maxAge: input.maxAge,
        genderPreference: input.genderPreference ?? "everyone",
        maxDistance: 50,
      });
      return { saved: true as const, created: true as const };
    }),

  discover: protectedProcedure
    .input(datingDiscoveryInputSchema.optional())
    .query(async ({ ctx, input }) => {
      const storedPreference = (
        await db
          .select()
          .from(datingPreferences)
          .where(eq(datingPreferences.userId, ctx.user.id))
          .limit(1)
      )[0];

      const minAge = input?.minAge ?? storedPreference?.minAge ?? 18;
      const maxAge = input?.maxAge ?? storedPreference?.maxAge ?? 65;
      if (maxAge < minAge) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maximum age must be greater than or equal to minimum age",
        });
      }

      const effectiveGenderPreference =
        input?.genderPreference ??
        (storedPreference?.genderPreference === "men" ||
        storedPreference?.genderPreference === "women" ||
        storedPreference?.genderPreference === "everyone"
          ? storedPreference.genderPreference
          : "everyone");
      const locationQuery = input?.location?.trim().toLocaleLowerCase() ?? "";
      const interestQuery = input?.interest?.trim().toLocaleLowerCase() ?? "";
      const limit = input?.limit ?? 25;

      const viewerProfile = await db.query.datingProfiles.findFirst({
        where: eq(datingProfiles.userId, ctx.user.id),
      });
      if (
        !viewerProfile ||
        typeof viewerProfile.age !== "number" ||
        viewerProfile.age < 18
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Create an adult dating profile before using discovery",
        });
      }

      const [blockRows, likedRows, pairRows, candidateRows] =
        await Promise.all([
          db
            .select({
              userId: datingBlocks.userId,
              blockedUserId: datingBlocks.blockedUserId,
            })
            .from(datingBlocks)
            .where(
              or(
                eq(datingBlocks.userId, ctx.user.id),
                eq(datingBlocks.blockedUserId, ctx.user.id)
              )
            ),
          db
            .select({ likedUserId: datingLikes.likedUserId })
            .from(datingLikes)
            .where(eq(datingLikes.userId, ctx.user.id)),
          db
            .select({
              userId1: datingMatches.userId1,
              userId2: datingMatches.userId2,
              status: datingMatches.status,
            })
            .from(datingMatches)
            .where(
              or(
                eq(datingMatches.userId1, ctx.user.id),
                eq(datingMatches.userId2, ctx.user.id)
              )
            ),
          db
            .select({
              id: datingProfiles.id,
              userId: datingProfiles.userId,
              bio: datingProfiles.bio,
              interests: datingProfiles.interests,
              location: datingProfiles.location,
              age: datingProfiles.age,
              gender: datingProfiles.gender,
              lookingFor: datingProfiles.lookingFor,
              createdAt: datingProfiles.createdAt,
              displayName: users.name,
              username: users.username,
              profileImageUrl: users.avatar,
              profileVisibility: users.profileVisibility,
            })
            .from(datingProfiles)
            .leftJoin(users, eq(datingProfiles.userId, users.id))
            .where(
              and(
                gte(datingProfiles.age, minAge),
                lte(datingProfiles.age, maxAge)
              )
            )
            .orderBy(desc(datingProfiles.createdAt))
            .limit(200),
        ]);

      const excluded = new Set<string>([ctx.user.id]);
      for (const block of blockRows) {
        excluded.add(
          block.userId === ctx.user.id ? block.blockedUserId : block.userId
        );
      }
      for (const like of likedRows) excluded.add(like.likedUserId);
      for (const pair of pairRows) {
        if (pair.status === "matched" || pair.status === "rejected") {
          excluded.add(
            pair.userId1 === ctx.user.id ? pair.userId2 : pair.userId1
          );
        }
      }

      const genderMatches = (gender: string | null) => {
        if (effectiveGenderPreference === "everyone") return true;
        if (effectiveGenderPreference === "men") return gender === "man";
        return gender === "woman";
      };

      const profiles = candidateRows
        .filter(row => !excluded.has(row.userId))
        .filter(row => row.profileVisibility !== "private")
        .filter(row => genderMatches(row.gender))
        .filter(row => {
          if (!locationQuery) return true;
          return (row.location ?? "")
            .toLocaleLowerCase()
            .includes(locationQuery);
        })
        .filter(row => {
          if (!interestQuery) return true;
          return parseDatingInterests(row.interests).some(interest =>
            interest.toLocaleLowerCase().includes(interestQuery)
          );
        })
        .map(row => ({
          id: row.id,
          userId: row.userId,
          displayName: row.displayName || row.username || "Member",
          age: row.age,
          location: row.location ?? "",
          bio: row.bio ?? "",
          profileImageUrl: row.profileImageUrl ?? "",
          interests: parseDatingInterests(row.interests),
          gender: row.gender,
          lookingFor: row.lookingFor,
          createdAt: row.createdAt,
          ...buildDatingConnectionEvidence(viewerProfile, row),
        }))
        .sort((a, b) => b.sharedSignalCount - a.sharedSignalCount)
        .slice(0, limit);

      return {
        profiles,
        filters: {
          minAge,
          maxAge,
          genderPreference: effectiveGenderPreference,
          location: input?.location ?? "",
          interest: input?.interest ?? "",
        },
        scope:
          "Adult profiles from the integrated dating table, excluding self, private profiles, blocked profiles, prior likes, active matches, and rejected pairs. Shared signals are deterministic overlap, not relationship-outcome predictions.",
      };
    }),

  act: protectedProcedure
    .input(datingActionInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.profileUserId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot act on your own dating profile",
        });
      }
      await assertAdultDatingTarget(input.profileUserId);
      if (await pairIsBlocked(ctx.user.id, input.profileUserId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This dating interaction is unavailable",
        });
      }

      const pair = await findPairMatch(ctx.user.id, input.profileUserId);

      if (input.action === "pass") {
        if (pair?.status === "matched") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Use unmatch or block for an active match",
          });
        }

        await db
          .delete(datingLikes)
          .where(
            and(
              eq(datingLikes.userId, ctx.user.id),
              eq(datingLikes.likedUserId, input.profileUserId)
            )
          );

        await rejectDatingPair(
          ctx.user.id,
          input.profileUserId,
          pair
        );

        return {
          accepted: true as const,
          action: input.action,
          matched: false,
        };
      }

      const existingLike = (
        await db
          .select()
          .from(datingLikes)
          .where(
            and(
              eq(datingLikes.userId, ctx.user.id),
              eq(datingLikes.likedUserId, input.profileUserId)
            )
          )
          .limit(1)
      )[0];

      if (existingLike) {
        if (
          input.action === "superlike" &&
          existingLike.type !== "superlike"
        ) {
          await db
            .update(datingLikes)
            .set({ type: "superlike" })
            .where(eq(datingLikes.id, existingLike.id));
        }
      } else {
        await db.insert(datingLikes).values({
          id: randomUUID(),
          userId: ctx.user.id,
          likedUserId: input.profileUserId,
          type: input.action,
        });
        await db.insert(datingNotifications).values({
          id: randomUUID(),
          userId: input.profileUserId,
          type: "like",
          relatedUserId: ctx.user.id,
          read: false,
        });
      }

      const reciprocal = (
        await db
          .select({ id: datingLikes.id })
          .from(datingLikes)
          .where(
            and(
              eq(datingLikes.userId, input.profileUserId),
              eq(datingLikes.likedUserId, ctx.user.id)
            )
          )
          .limit(1)
      )[0];

      if (!reciprocal || pair?.status === "rejected") {
        return {
          accepted: true as const,
          action: input.action,
          matched: false,
        };
      }

      const { matchId, becameMatch } = await activateMutualMatch(
        ctx.user.id,
        input.profileUserId,
        pair
      );

      if (becameMatch) {
        await Promise.all([
          insertDatingNotificationOnce({
            id: matchNotificationId(matchId, ctx.user.id),
            userId: ctx.user.id,
            type: "match",
            relatedUserId: input.profileUserId,
          }),
          insertDatingNotificationOnce({
            id: matchNotificationId(matchId, input.profileUserId),
            userId: input.profileUserId,
            type: "match",
            relatedUserId: ctx.user.id,
          }),
        ]);
      }

      return {
        accepted: true as const,
        action: input.action,
        matched: true,
        matchId,
      };
    }),

  matches: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select()
      .from(datingMatches)
      .where(
        and(
          eq(datingMatches.status, "matched"),
          or(
            eq(datingMatches.userId1, ctx.user.id),
            eq(datingMatches.userId2, ctx.user.id)
          )
        )
      )
      .orderBy(desc(datingMatches.createdAt))
      .limit(100);

    const output = [];
    for (const match of rows) {
      const otherUserId =
        match.userId1 === ctx.user.id ? match.userId2 : match.userId1;
      if (await pairIsBlocked(ctx.user.id, otherUserId)) continue;

      const other = (
        await db
          .select({
            id: users.id,
            displayName: users.name,
            username: users.username,
            profileImageUrl: users.avatar,
            age: datingProfiles.age,
            location: datingProfiles.location,
            interests: datingProfiles.interests,
            lookingFor: datingProfiles.lookingFor,
          })
          .from(users)
          .leftJoin(datingProfiles, eq(datingProfiles.userId, users.id))
          .where(eq(users.id, otherUserId))
          .limit(1)
      )[0];

      if (!other || typeof other.age !== "number" || other.age < 18) continue;

      const lastMessage = (
        await db
          .select({ createdAt: datingMessages.createdAt })
          .from(datingMessages)
          .where(eq(datingMessages.matchId, match.id))
          .orderBy(desc(datingMessages.createdAt))
          .limit(1)
      )[0];

      output.push({
        id: match.id,
        userId1: match.userId1,
        userId2: match.userId2,
        createdAt: match.createdAt,
        lastMessageAt: lastMessage?.createdAt ?? null,
        matchedUser: {
          id: other.id,
          displayName: other.displayName || other.username || "Member",
          profileImageUrl: other.profileImageUrl ?? "",
          age: other.age,
          location: other.location ?? "",
          interests: parseDatingInterests(other.interests),
          lookingFor: other.lookingFor,
        },
      });
    }

    return output;
  }),

  conversation: protectedProcedure
    .input(z.object({ matchId: z.string().trim().min(1).max(255) }))
    .query(async ({ ctx, input }) => {
      await requireMatchedConversation(input.matchId, ctx.user.id);
      const newest = await db
        .select({
          id: datingMessages.id,
          matchId: datingMessages.matchId,
          senderId: datingMessages.senderId,
          content: datingMessages.content,
          read: datingMessages.read,
          createdAt: datingMessages.createdAt,
        })
        .from(datingMessages)
        .where(eq(datingMessages.matchId, input.matchId))
        .orderBy(desc(datingMessages.createdAt))
        .limit(500);
      return newest.reverse();
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        matchId: z.string().trim().min(1).max(255),
        content: z.string().trim().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { otherUserId } = await requireMatchedConversation(
        input.matchId,
        ctx.user.id
      );

      const id = randomUUID();
      await db.insert(datingMessages).values({
        id,
        matchId: input.matchId,
        senderId: ctx.user.id,
        content: input.content,
        read: false,
      });
      await db.insert(datingNotifications).values({
        id: randomUUID(),
        userId: otherUserId,
        type: "message",
        relatedUserId: ctx.user.id,
        read: false,
      });

      return {
        id,
        matchId: input.matchId,
        senderId: ctx.user.id,
        content: input.content,
        accepted: true as const,
      };
    }),

  unmatch: protectedProcedure
    .input(z.object({ matchId: z.string().trim().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const { match } = await requireMatchedConversation(
        input.matchId,
        ctx.user.id
      );
      await db
        .update(datingMatches)
        .set({ status: "rejected" })
        .where(eq(datingMatches.id, match.id));
      return {
        unmatched: true as const,
        message:
          "Match closed. Existing messages remain stored but are no longer exposed through the active-match conversation API.",
      };
    }),

  block: protectedProcedure
    .input(
      z.object({
        userId: z.string().trim().min(1).max(255),
        reason: z.string().trim().max(255).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot block your own account",
        });
      }
      return blockPair(ctx.user.id, input.userId, input.reason);
    }),

  report: protectedProcedure
    .input(
      z.object({
        userId: z.string().trim().min(1).max(255),
        reason: reportReason,
        details: z.string().trim().max(160).optional(),
        blockAfterReport: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot report your own account",
        });
      }
      await assertAdultDatingTarget(input.userId);

      const reason = input.details
        ? `${input.reason}: ${input.details}`.slice(0, 255)
        : input.reason;
      const id = randomUUID();
      await db.insert(datingReports).values({
        id,
        reporterId: ctx.user.id,
        reportedUserId: input.userId,
        reason,
        status: "pending",
      });

      const blockResult = input.blockAfterReport
        ? await blockPair(ctx.user.id, input.userId, "reported")
        : null;

      return {
        id,
        status: "pending" as const,
        blocked: blockResult?.blocked ?? false,
        message:
          "Report recorded for review. This does not claim automated investigation, identity verification, or emergency response.",
      };
    }),

  notifications: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(datingNotifications)
      .where(eq(datingNotifications.userId, ctx.user.id))
      .orderBy(desc(datingNotifications.createdAt))
      .limit(50);
  }),

  markNotificationRead: protectedProcedure
    .input(z.object({ id: z.string().trim().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const row = (
        await db
          .select({ id: datingNotifications.id })
          .from(datingNotifications)
          .where(
            and(
              eq(datingNotifications.id, input.id),
              eq(datingNotifications.userId, ctx.user.id)
            )
          )
          .limit(1)
      )[0];
      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dating notification not found",
        });
      }
      await db
        .update(datingNotifications)
        .set({ read: true })
        .where(eq(datingNotifications.id, input.id));
      return { read: true as const };
    }),

  markAllNotificationsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(datingNotifications)
      .set({ read: true })
      .where(eq(datingNotifications.userId, ctx.user.id));
    return { read: true as const };
  }),

  markConversationRead: protectedProcedure
    .input(z.object({ matchId: z.string().trim().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const { otherUserId } = await requireMatchedConversation(
        input.matchId,
        ctx.user.id
      );

      await db
        .update(datingMessages)
        .set({ read: true })
        .where(
          and(
            eq(datingMessages.matchId, input.matchId),
            ne(datingMessages.senderId, ctx.user.id)
          )
        );

      await db
        .update(datingNotifications)
        .set({ read: true })
        .where(
          and(
            eq(datingNotifications.userId, ctx.user.id),
            eq(datingNotifications.relatedUserId, otherUserId),
            eq(datingNotifications.type, "message")
          )
        );

      return { read: true as const };
    }),

  subscription: protectedProcedure.query(async ({ ctx }) => {
    const row = (
      await db
        .select()
        .from(datingSubscriptions)
        .where(eq(datingSubscriptions.userId, ctx.user.id))
        .orderBy(desc(datingSubscriptions.createdAt))
        .limit(1)
    )[0];

    return {
      tier: row?.tier ?? "free",
      expiresAt: row?.expiresAt ?? null,
      billingConfigured: false,
      checkoutAvailable: false,
      note:
        "Dating billing and paid entitlement checkout are not integrated in this engineering beta.",
    };
  }),

  summary: protectedProcedure.query(async ({ ctx }) => {
    const [profile, matches, notifications] = await Promise.all([
      db.query.datingProfiles.findFirst({
        where: eq(datingProfiles.userId, ctx.user.id),
      }),
      db
        .select({ id: datingMatches.id })
        .from(datingMatches)
        .where(
          and(
            eq(datingMatches.status, "matched"),
            or(
              eq(datingMatches.userId1, ctx.user.id),
              eq(datingMatches.userId2, ctx.user.id)
            )
          )
        ),
      db
        .select({ id: datingNotifications.id, read: datingNotifications.read })
        .from(datingNotifications)
        .where(eq(datingNotifications.userId, ctx.user.id)),
    ]);

    return {
      profileCreated: Boolean(profile),
      adultProfile: typeof profile?.age === "number" && profile.age >= 18,
      matchCount: matches.length,
      unreadCount: notifications.filter(item => item.read !== true).length,
      limits:
        "No identity verification, background checks, precise-distance filtering, billing, or emergency-response service is claimed.",
    };
  }),
});
