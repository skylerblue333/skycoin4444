import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import * as schema from "../drizzle/schema";
import { createPost, db, getPosts } from "./db";

// Create a base router template for all feature modules
const unavailableFeature = (feature: string): never => {
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: `${feature} is unavailable until its verified persistence and authorization contract is configured.`,
  });
};

const createFeatureRouter = () => router({
  list: publicProcedure.query(() => [] as const),
  get: publicProcedure.input(z.string()).query(() => null),
  create: protectedProcedure.input(z.record(z.string(), z.unknown())).mutation(() => unavailableFeature("This feature creation")),
  update: protectedProcedure.input(z.object({ id: z.string() }).and(z.record(z.string(), z.unknown()))).mutation(() => unavailableFeature("This feature update")),
  delete: protectedProcedure.input(z.string()).mutation(() => unavailableFeature("This feature deletion")),
});

const feedRouter = router({
  list: publicProcedure.input(z.object({ limit: z.number().int().positive().max(100).optional(), offset: z.number().int().nonnegative().optional() }).optional()).query(async ({ input }) => {
    const posts = await getPosts(input?.limit ?? 20, input?.offset ?? 0);
    return posts.map(post => ({
      ...post,
      authorId: post.userId,
      mediaUrl: post.media,
      likeCount: post.likes,
      commentCount: post.comments,
    }));
  }),
  create: protectedProcedure.input(z.object({ content: z.string().trim().min(1).max(255), media: z.string().url().max(255).optional() })).mutation(async ({ input, ctx }) => {
    const post = await createPost(ctx.user.id, input.content, input.media);
    if (!post) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Post could not be persisted." });
    return post;
  }),
  get: publicProcedure.input(z.string().min(1)).query(async ({ input }) => {
    const posts = await getPosts(100, 0);
    return posts.find(post => post.id === input) ?? null;
  }),
});

const userRouter = router({
  profile: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ input, ctx }) => {
    if (input.userId !== ctx.user.id) return null;
    return db.query.users.findFirst({ where: eq(schema.users.id, input.userId) });
  }),
  profileByUsername: publicProcedure.input(z.object({ username: z.string().trim().min(1).max(255) })).query(async ({ input }) => {
    const user = await db.query.users.findFirst({ where: eq(schema.users.username, input.username) });
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      verified: user.verified,
      createdAt: user.createdAt,
    };
  }),
  suggestedFollows: protectedProcedure.query(() => [] as const),
  followers: protectedProcedure.input(z.object({ userId: z.string() })).query(() => [] as const),
  following: protectedProcedure.input(z.object({ userId: z.string() })).query(() => [] as const),
  leaderboard: publicProcedure.input(z.object({ type: z.string().min(1), limit: z.number().int().positive().max(100) })).query(() => [] as const),
  follow: protectedProcedure.input(z.object({ userId: z.string() })).mutation(() => unavailableFeature("Following users")),
  updateProfile: protectedProcedure.input(z.object({
    name: z.string().trim().min(1).max(255).optional(),
    username: z.string().trim().min(1).max(255).regex(/^[A-Za-z0-9_]+$/).optional(),
    bio: z.string().trim().max(255).optional(),
  }).refine(input => Object.keys(input).length > 0, "At least one profile field is required")).mutation(async ({ input, ctx }) => {
    await db.update(schema.users).set(input).where(eq(schema.users.id, ctx.user.id));
    return db.query.users.findFirst({ where: eq(schema.users.id, ctx.user.id) });
  }),
  uploadAvatar: protectedProcedure.input(z.object({ data: z.string(), type: z.enum(["avatar", "banner"]), mimeType: z.string() })).mutation(() => unavailableFeature("Profile image uploads")),
});

export const appRouter = router({
  system: systemRouter,
  user: userRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // AI & Agents Routers
  ai: createFeatureRouter(),
  aiEngineer: createFeatureRouter(),
  aiMarket: createFeatureRouter(),
  aiPersonas: createFeatureRouter(),
  hopeAI: createFeatureRouter(),
  hopeIntelligence: createFeatureRouter(),
  agents44: createFeatureRouter(),

  // Social & Community Routers
  social: createFeatureRouter(),
  socialCore: createFeatureRouter(),
  feed: feedRouter,
  community: createFeatureRouter(),
  dm: createFeatureRouter(),
  story: createFeatureRouter(),

  // Marketplace & Commerce Routers
  marketplace: createFeatureRouter(),
  creator: createFeatureRouter(),
  creatorGrowth: createFeatureRouter(),
  digitalArt: createFeatureRouter(),
  payments: createFeatureRouter(),

  // Blockchain & Crypto Routers
  blockchain: createFeatureRouter(),
  staking: createFeatureRouter(),
  economy: createFeatureRouter(),
  gamefi: createFeatureRouter(),
  ico: createFeatureRouter(),

  // Admin & Moderation Routers
  admin: createFeatureRouter(),
  moderation: createFeatureRouter(),
  auditLogs: createFeatureRouter(),
  security: createFeatureRouter(),
  complianceIntelligence: createFeatureRouter(),

  // Platform & Enterprise Routers
  platform: createFeatureRouter(),
  enterprise: createFeatureRouter(),
  governance: createFeatureRouter(),
  orchestrator: createFeatureRouter(),
  search: createFeatureRouter(),

  // Gaming & Gamification Routers
  gamification: createFeatureRouter(),
  simulation: createFeatureRouter(),
  legendary: createFeatureRouter(),

  // Additional Feature Routers
  charity: createFeatureRouter(),
  stream: createFeatureRouter(),
  languageExchange: createFeatureRouter(),
  audienceLockIn: createFeatureRouter(),
  shadowIdentity: createFeatureRouter(),
  proofVault: createFeatureRouter(),
  goc: createFeatureRouter(),
  notifIntelligence: createFeatureRouter(),
  investor: createFeatureRouter(),
  installer: createFeatureRouter(),
  sprint: createFeatureRouter(),

  // Explicitly bounded namespaces awaiting verified contracts
  analytics: createFeatureRouter(),
  codeQuality: createFeatureRouter(),
  engineer: createFeatureRouter(),
  escrow: createFeatureRouter(),
  gaming: createFeatureRouter(),
  hopeaiAdvanced: createFeatureRouter(),
  notifications: createFeatureRouter(),
  phase20a: createFeatureRouter(),
  phase20d: createFeatureRouter(),
  phase20j: createFeatureRouter(),
  token: createFeatureRouter(),
  trading: createFeatureRouter(),
  trustSafety: createFeatureRouter(),
  video: createFeatureRouter(),
  wallet: createFeatureRouter(),
  wave2AiCore: createFeatureRouter(),
  wave2Marketplace: createFeatureRouter(),
  wave2Notifications: createFeatureRouter(),
  wave2Profile: createFeatureRouter(),
  wave3Learning: createFeatureRouter(),
  wave4Admin: createFeatureRouter(),
  wave4Creator: createFeatureRouter(),
  wave4Explore: createFeatureRouter(),
  wave4Payments: createFeatureRouter(),
  wave4Security: createFeatureRouter(),
  wave4Settings: createFeatureRouter(),
});

export type AppRouter = typeof appRouter;
