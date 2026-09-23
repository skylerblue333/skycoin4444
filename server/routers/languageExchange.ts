import { TRPCError } from "@trpc/server";
import { and, eq, ne, or } from "drizzle-orm";
import { z } from "zod";
import { languageExchangeProfiles, users } from "../../drizzle/schema";
import { db } from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { languageMatchScore } from "../services/languageExchangeMatching";

const cefrLevel = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);
const correctionPreference = z.enum(["ask-first", "gentle", "direct"]);

const compatibilityInput = z.union([
  z.void(),
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.unknown()),
  z.record(z.string(), z.unknown()),
]);

function unavailableCompatibility(operation: string): any {
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: `Language Exchange ${operation} API is not implemented yet`,
  });
}

const unavailableQuery = (operation: string) =>
  publicProcedure
    .input(compatibilityInput)
    .query(() => unavailableCompatibility(operation));

const unavailableMutation = (operation: string) =>
  protectedProcedure
    .input(compatibilityInput)
    .mutation(() => unavailableCompatibility(operation));

const profileInput = z.object({
  nativeLanguage: z.string().trim().min(2).max(64),
  learningLanguage: z.string().trim().min(2).max(64),
  level: cefrLevel,
  sessionMinutes: z.union([z.literal(30), z.literal(45), z.literal(60)]),
  availability: z.string().trim().max(255).default(""),
  goals: z.string().trim().min(5).max(500),
  topics: z.string().trim().max(500).default(""),
  correctionPreference: correctionPreference.default("ask-first"),
  discoverable: z.boolean().default(false),
}).refine(
  input => input.nativeLanguage.toLowerCase() !== input.learningLanguage.toLowerCase(),
  { message: "Native and learning languages must be different", path: ["learningLanguage"] }
);

export const languageExchangeRouter = router({
  // Preserve legacy client contracts as explicit unavailable endpoints while
  // the real beta APIs below replace them incrementally.
  get: unavailableQuery("get"),
  getBounties: unavailableQuery("getBounties"),
  completeBounty: unavailableMutation("completeBounty"),
  getProficiency: unavailableQuery("getProficiency"),
  logSession: unavailableMutation("logSession"),
  getStats: unavailableQuery("getStats"),

  profile: protectedProcedure.query(async ({ ctx }) => {
    return (
      (await db
        .select()
        .from(languageExchangeProfiles)
        .where(eq(languageExchangeProfiles.userId, ctx.user.id))
        .limit(1))[0] ?? null
    );
  }),

  upsertProfile: protectedProcedure
    .input(profileInput)
    .mutation(async ({ ctx, input }) => {
      const existing = (
        await db
          .select({ userId: languageExchangeProfiles.userId })
          .from(languageExchangeProfiles)
          .where(eq(languageExchangeProfiles.userId, ctx.user.id))
          .limit(1)
      )[0];

      const values = {
        userId: ctx.user.id,
        nativeLanguage: input.nativeLanguage,
        learningLanguage: input.learningLanguage,
        level: input.level,
        sessionMinutes: input.sessionMinutes,
        availability: input.availability || null,
        goals: input.goals,
        topics: input.topics || null,
        correctionPreference: input.correctionPreference,
        discoverable: input.discoverable,
        updatedAt: new Date(),
      };

      if (existing) {
        await db
          .update(languageExchangeProfiles)
          .set(values)
          .where(eq(languageExchangeProfiles.userId, ctx.user.id));
      } else {
        await db.insert(languageExchangeProfiles).values(values);
      }

      return values;
    }),

  partners: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const own = (
        await db
          .select()
          .from(languageExchangeProfiles)
          .where(eq(languageExchangeProfiles.userId, ctx.user.id))
          .limit(1)
      )[0];
      if (!own) return [];

      const candidates = await db
        .select({
          userId: languageExchangeProfiles.userId,
          nativeLanguage: languageExchangeProfiles.nativeLanguage,
          learningLanguage: languageExchangeProfiles.learningLanguage,
          level: languageExchangeProfiles.level,
          sessionMinutes: languageExchangeProfiles.sessionMinutes,
          availability: languageExchangeProfiles.availability,
          goals: languageExchangeProfiles.goals,
          topics: languageExchangeProfiles.topics,
          correctionPreference: languageExchangeProfiles.correctionPreference,
          updatedAt: languageExchangeProfiles.updatedAt,
          name: users.name,
          username: users.username,
          avatar: users.avatar,
        })
        .from(languageExchangeProfiles)
        .innerJoin(users, eq(languageExchangeProfiles.userId, users.id))
        .where(
          and(
            eq(languageExchangeProfiles.discoverable, true),
            ne(languageExchangeProfiles.userId, ctx.user.id),
            ne(users.profileVisibility, "private"),
            or(
              eq(languageExchangeProfiles.nativeLanguage, own.learningLanguage),
              eq(languageExchangeProfiles.learningLanguage, own.nativeLanguage)
            )
          )
        );

      return candidates
        .map(candidate => {
          const match = languageMatchScore(own, candidate);
          return { ...candidate, ...match };
        })
        .filter(candidate => candidate.kind !== "none")
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          const aName = a.name ?? a.username ?? a.userId;
          const bName = b.name ?? b.username ?? b.userId;
          return aName.localeCompare(bName, "en");
        })
        .slice(0, input?.limit ?? 20);
    }),
});
