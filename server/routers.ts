import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { aiRouter } from "./routers/ai";

const unavailable = (feature: string, operation: string): never => {
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: `${feature} ${operation} API is not implemented yet`,
  });
};

// Truthful compatibility contract for feature areas that are registered in the
// client but do not yet have a real backend implementation. Never return fake
// data or fake mutation success from these endpoints.
const createUnavailableFeatureRouter = (feature: string) =>
  router({
    list: publicProcedure.query(() => unavailable(feature, "list")),
    get: publicProcedure.input(z.string()).query(() => unavailable(feature, "get")),
    create: protectedProcedure
      .input(z.object({}).passthrough())
      .mutation(() => unavailable(feature, "create")),
    update: protectedProcedure
      .input(z.object({ id: z.string() }).passthrough())
      .mutation(() => unavailable(feature, "update")),
    delete: protectedProcedure
      .input(z.string())
      .mutation(() => unavailable(feature, "delete")),
  });

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // AI & Agents Routers
  ai: aiRouter,
  aiEngineer: createUnavailableFeatureRouter("AI Engineer"),
  aiMarket: createUnavailableFeatureRouter("AI Market"),
  aiPersonas: createUnavailableFeatureRouter("AI Personas"),
  hopeAI: createUnavailableFeatureRouter("HopeAI"),
  hopeIntelligence: createUnavailableFeatureRouter("Hope Intelligence"),
  agents44: createUnavailableFeatureRouter("Agents44"),

  // Social & Community Routers
  social: createUnavailableFeatureRouter("Social"),
  socialCore: createUnavailableFeatureRouter("Social Core"),
  feed: createUnavailableFeatureRouter("Feed"),
  community: createUnavailableFeatureRouter("Community"),
  dm: createUnavailableFeatureRouter("Direct Messaging"),
  story: createUnavailableFeatureRouter("Story"),

  // Marketplace & Commerce Routers
  marketplace: createUnavailableFeatureRouter("Marketplace"),
  creator: createUnavailableFeatureRouter("Creator"),
  creatorGrowth: createUnavailableFeatureRouter("Creator Growth"),
  digitalArt: createUnavailableFeatureRouter("Digital Art"),
  payments: createUnavailableFeatureRouter("Payments"),

  // Blockchain & Crypto Routers
  blockchain: createUnavailableFeatureRouter("Blockchain"),
  staking: createUnavailableFeatureRouter("Staking"),
  economy: createUnavailableFeatureRouter("Economy"),
  gamefi: createUnavailableFeatureRouter("GameFi"),
  ico: createUnavailableFeatureRouter("ICO"),

  // Admin & Moderation Routers
  admin: createUnavailableFeatureRouter("Admin"),
  moderation: createUnavailableFeatureRouter("Moderation"),
  auditLogs: createUnavailableFeatureRouter("Audit Logs"),
  security: createUnavailableFeatureRouter("Security"),
  complianceIntelligence: createUnavailableFeatureRouter("Compliance Intelligence"),

  // Platform & Enterprise Routers
  platform: createUnavailableFeatureRouter("Platform"),
  enterprise: createUnavailableFeatureRouter("Enterprise"),
  governance: createUnavailableFeatureRouter("Governance"),
  orchestrator: createUnavailableFeatureRouter("Orchestrator"),
  search: createUnavailableFeatureRouter("Search"),

  // Gaming & Gamification Routers
  gamification: createUnavailableFeatureRouter("Gamification"),
  simulation: createUnavailableFeatureRouter("Simulation"),
  legendary: createUnavailableFeatureRouter("Legendary"),

  // Additional Feature Routers
  charity: createUnavailableFeatureRouter("Charity"),
  stream: createUnavailableFeatureRouter("Stream"),
  languageExchange: createUnavailableFeatureRouter("Language Exchange"),
  audienceLockIn: createUnavailableFeatureRouter("Audience Lock-In"),
  shadowIdentity: createUnavailableFeatureRouter("Shadow Identity"),
  proofVault: createUnavailableFeatureRouter("Proof Vault"),
  goc: createUnavailableFeatureRouter("GOC"),
  notifIntelligence: createUnavailableFeatureRouter("Notification Intelligence"),
  investor: createUnavailableFeatureRouter("Investor"),
  installer: createUnavailableFeatureRouter("Installer"),
  sprint: createUnavailableFeatureRouter("Sprint"),
});

export type AppRouter = typeof appRouter;
