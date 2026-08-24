import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { aiRouter } from "./routers/ai";

// Deliberately typed as `any`: these procedures must remain compatible with the
// existing client surface while still failing truthfully at runtime. Returning
// `never` makes tRPC infer unusable client data types and causes unrelated UI
// type failures even though the endpoint is intentionally unavailable.
const unavailable = (feature: string, operation: string): any => {
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: `${feature} ${operation} API is not implemented yet`,
  });
};

const createUnavailableFeatureRouter = (feature: string) => {
  const query = (operation: string) =>
    publicProcedure.input(z.any().optional()).query(() => unavailable(feature, operation));
  const mutation = (operation: string) =>
    protectedProcedure.input(z.any().optional()).mutation(() => unavailable(feature, operation));

  return router({
    // Generic CRUD compatibility
    list: query("list"),
    get: query("get"),
    create: mutation("create"),
    update: mutation("update"),
    delete: mutation("delete"),

    // Read/query compatibility used across the existing client.
    stats: query("stats"),
    health: query("health"),
    logs: query("logs"),
    users: query("users"),
    queue: query("queue"),
    moderationQueue: query("moderationQueue"),
    history: query("history"),
    metrics: query("metrics"),
    getAll: query("getAll"),
    getFeed: query("getFeed"),
    tournaments: query("tournaments"),
    quests: query("quests"),
    getBattlePass: query("getBattlePass"),
    bookmarks: query("bookmarks"),
    getBounties: query("getBounties"),
    campaigns: query("campaigns"),
    leaderboard: query("leaderboard"),
    conversations: query("conversations"),
    reputation: query("reputation"),
    behavior: query("behavior"),
    governanceV2: query("governanceV2"),
    economy: query("economy"),
    emergent: query("emergent"),
    analytics: query("analytics"),
    earnings: query("earnings"),
    milestones: query("milestones"),
    fanScores: query("fanScores"),
    revenueForecasting: query("revenueForecasting"),
    mySubscriptions: query("mySubscriptions"),
    memoryGraph: query("memoryGraph"),
    twin: query("twin"),
    github: query("github"),
    trending: query("trending"),
    live: query("live"),
    pools: query("pools"),
    freeWill: query("freeWill"),
    tokenRegistry: query("tokenRegistry"),
    regions: query("regions"),
    ambassadors: query("ambassadors"),
    heatmap: query("heatmap"),
    growthAnalysis: query("growthAnalysis"),
    getWorldState: query("getWorldState"),
    kpis: query("kpis"),
    revenue: query("revenue"),
    treasury: query("treasury"),
    getPartners: query("getPartners"),
    getFavorites: query("getFavorites"),
    founderProfile: query("founderProfile"),
    platformMetrics: query("platformMetrics"),
    missionControl: query("missionControl"),
    myOrders: query("myOrders"),
    getProficiency: query("getProficiency"),
    getStats: query("getStats"),
    getDashboard: query("getDashboard"),
    reelsFeed: query("reelsFeed"),
    getStreak: query("getStreak"),
    getLoyaltyProfile: query("getLoyaltyProfile"),
    getUserBadges: query("getUserBadges"),
    getActiveQuests: query("getActiveQuests"),
    getFanLevel: query("getFanLevel"),
    myActivity: query("myActivity"),
    getSpinPrizes: query("getSpinPrizes"),
    getState: query("getState"),
    seasonPass: query("seasonPass"),
    security: query("security"),
    orderHistory: query("orderHistory"),

    // Mutation compatibility. These always throw NOT_IMPLEMENTED until a real
    // backend exists; none of them fabricate a successful transaction.
    resolve: mutation("resolve"),
    tip: mutation("tip"),
    banUser: mutation("banUser"),
    updateUserRole: mutation("updateUserRole"),
    triggerSprint: mutation("triggerSprint"),
    claimTier: mutation("claimTier"),
    removeBookmark: mutation("removeBookmark"),
    completeBounty: mutation("completeBounty"),
    donate: mutation("donate"),
    send: mutation("send"),
    join: mutation("join"),
    createReel: mutation("createReel"),
    subscribeWithStripe: mutation("subscribeWithStripe"),
    requestSession: mutation("requestSession"),
    saveFavorite: mutation("saveFavorite"),
    removeFavorite: mutation("removeFavorite"),
    logSession: mutation("logSession"),
    createCheckout: mutation("createCheckout"),
    recordEngagement: mutation("recordEngagement"),
    recordActivity: mutation("recordActivity"),
    generateFiles: mutation("generateFiles"),
    spin: mutation("spin"),
  });
};

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
  user: createUnavailableFeatureRouter("User"),

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
  wallet: createUnavailableFeatureRouter("Wallet"),
  token: createUnavailableFeatureRouter("Token"),

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
