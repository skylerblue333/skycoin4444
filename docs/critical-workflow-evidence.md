# Critical Workflow Evidence
## Tests
./server/auth.logout.test.ts
## Router security/procedure markers
4:import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
9:const unavailableMutationResult = {
37:    list: publicProcedure
47:    get: publicProcedure.input(z.string()).query(({ input }) => ({})),
48:    getFeed: publicProcedure
51:    listVideos: publicProcedure
54:    getDashboard: protectedProcedure.query(() => ({
59:    myActivity: protectedProcedure
62:    global: publicProcedure.input(z.unknown().optional()).query(() => ({
69:    history: protectedProcedure
72:    metrics: protectedProcedure.input(z.unknown().optional()).query(() => ({
76:    triggerSprint: protectedProcedure
78:      .mutation(() => unavailableMutationResult),
79:    create: protectedProcedure
81:      .mutation(() => unavailableMutationResult),
82:    update: protectedProcedure
84:      .mutation(() => unavailableMutationResult),
85:    delete: protectedProcedure
87:      .mutation(() => unavailableMutationResult),
91:  getBalance: protectedProcedure.query(async ({ ctx }) => {
104:  getConnections: protectedProcedure.query(async ({ ctx }) => {
115:  getTransactionHistory: protectedProcedure
135:  getTransactions: protectedProcedure
148:  connectWallet: protectedProcedure
156:    .mutation(() => unavailableMutationResult),
157:  send: protectedProcedure
165:    .mutation(() => unavailableMutationResult),
185:  onChainBalance: protectedProcedure
199:  validateAddress: publicProcedure
207:  estimateGas: protectedProcedure
224:  myWallets: protectedProcedure.query(
236:  myTransactions: protectedProcedure
250:  supportedChains: publicProcedure.query(
260:  buildAndSign: protectedProcedure
277:  broadcast: protectedProcedure
285:  registerWallet: protectedProcedure
297:  getModels: publicProcedure.query(
300:  chat: protectedProcedure
312:  generateCode: protectedProcedure
315:  debugCode: protectedProcedure
318:  reviewCode: protectedProcedure
321:  optimizeCode: protectedProcedure
324:  learnTopic: protectedProcedure
327:  getCopyTemplates: publicProcedure.query(
337:  generateCopy: protectedProcedure
353:  improveCopy: protectedProcedure
356:  analyzeCopy: protectedProcedure
364:  translateCopy: protectedProcedure
376:  balances: protectedProcedure.query(async ({ ctx }) => {
387:  allBalances: protectedProcedure.query(async ({ ctx }) => {
398:  transactions: protectedProcedure
406:  metrics: publicProcedure.query(() => ({
416:  burnHistory: publicProcedure.query(
419:  tokenomics: publicProcedure.query(() => ({
426:  priceHistory: protectedProcedure
433:  vestingSchedules: protectedProcedure.query(
436:  claimVesting: protectedProcedure
438:    .mutation(() => unavailableMutationResult),
439:  whaleAlerts: protectedProcedure.query(() => ({
443:  mine: protectedProcedure
445:    .mutation(() => unavailableMutationResult),
446:  multiSwap: protectedProcedure
448:    .mutation(() => unavailableMutationResult),
449:  multiStake: protectedProcedure
451:    .mutation(() => unavailableMutationResult),
452:  burn: protectedProcedure
454:    .mutation(() => unavailableMutationResult),
458:  profileByUsername: publicProcedure
461:  profile: publicProcedure
469:  leaderboard: publicProcedure
488:  followers: publicProcedure
491:  following: publicProcedure
494:  suggestedFollows: publicProcedure.query(() => []),
495:  follow: protectedProcedure
497:    .mutation(() => unavailableMutationResult),
498:  updateProfile: protectedProcedure
511:    .mutation(() => unavailableMutationResult),
512:  uploadAvatar: protectedProcedure
520:    .mutation(() => unavailableMutationResult),
524:  conversations: protectedProcedure.query(
527:  messages: protectedProcedure.input(z.object({ channelId: z.number() })).query(
536:  unreadCount: protectedProcedure.query(() => ({
538:    ...unavailableMutationResult,
540:  send: protectedProcedure
542:    .mutation(() => unavailableMutationResult),
543:  deleteMessage: protectedProcedure
545:    .mutation(() => unavailableMutationResult),
546:  startConversation: protectedProcedure
548:    .mutation(() => unavailableMutationResult),
549:  markRead: protectedProcedure
551:    .mutation(() => unavailableMutationResult),
558:    me: publicProcedure.query(opts => opts.ctx.user),
559:    logout: publicProcedure.mutation(({ ctx }) => {
569:    getBots: publicProcedure.query(
572:    generateCode: protectedProcedure
590:    analyzeCode: protectedProcedure
609:    getStats: protectedProcedure.query(() => ({
619:    getLog: protectedProcedure
628:    getPushHistory: protectedProcedure
643:    getSessions: protectedProcedure.query(
646:    runAutonomousCycle: protectedProcedure
649:        ...unavailableMutationResult,
655:    getIcoStats: publicProcedure.query(() => ({
673:    getAgents: publicProcedure.query(
685:    getSignals: publicProcedure
704:    getActivity: publicProcedure
721:    triggerCycle: protectedProcedure
724:        ...unavailableMutationResult,
730:    getBlendedFeed: publicProcedure
755:    getPersonas: publicProcedure.query(() => ({
767:    getStats: publicProcedure.query(() => ({
780:    runCycle: protectedProcedure
786:      .mutation(() => ({ ...unavailableMutationResult, generated: 0 })),
787:    seedIfEmpty: protectedProcedure
790:        ...unavailableMutationResult,
796:    grayArea: protectedProcedure
821:    getChatHistory: protectedProcedure
838:    saveChatMessage: protectedProcedure
848:      .mutation(() => unavailableMutationResult),
849:    clearChatHistory: protectedProcedure
851:      .mutation(() => unavailableMutationResult),
852:    chat: protectedProcedure
874:      get: protectedProcedure.query(() => ({
882:      list: publicProcedure.input(z.object({}).optional()).query(
899:      get: publicProcedure.input(z.object({ id: z.number() })).query(
917:      create: protectedProcedure
925:        .mutation(() => unavailableMutationResult),
926:      toggleStep: protectedProcedure
934:        .mutation(() => unavailableMutationResult),
937:      list: publicProcedure
957:      balance: protectedProcedure.query(() => ({
964:      purchase: protectedProcedure
967:          ...unavailableMutationResult,
970:      myPurchases: protectedProcedure.query(
974:      rate: protectedProcedure
982:        .mutation(() => unavailableMutationResult),
983:      create: protectedProcedure
993:        .mutation(() => unavailableMutationResult),
996:      myMatches: protectedProcedure
1013:      network: protectedProcedure
1030:      refresh: protectedProcedure
1032:        .mutation(() => ({ ...unavailableMutationResult, scored: 0 })),
1033:      setStatus: protectedProcedure
1035:        .mutation(() => unavailableMutationResult),
1038:      me: protectedProcedure.query(() => ({
1052:      leaderboard: publicProcedure
1068:      recompute: protectedProcedure.mutation(() => unavailableMutationResult),
1071:      list: protectedProcedure
1074:      get: protectedProcedure.input(z.object({ id: z.string() })).query(
1089:      generate: protectedProcedure
1091:        .mutation(() => unavailableMutationResult),
1094:      today: protectedProcedure
1136:    getAll: publicProcedure.query(() => ({
1152:    list: publicProcedure.query(() => []),
1153:    createReel: protectedProcedure
1155:      .mutation(() => unavailableMutationResult),
1156:    reelsFeed: publicProcedure.query(
1159:    recordEngagement: protectedProcedure
1161:      .mutation(() => unavailableMutationResult),
1164:    list: publicProcedure
1174:    trending: publicProcedure.query(() => []),
1175:    bookmarks: publicProcedure.query(() => []),
1176:    github: publicProcedure.query(() => []),
1177:    like: protectedProcedure
1179:      .mutation(() => unavailableMutationResult),
1180:    removeBookmark: protectedProcedure
1182:      .mutation(() => unavailableMutationResult),
1185:    list: publicProcedure.input(z.object({}).optional()).query(
1200:    create: protectedProcedure
1215:      .mutation(() => unavailableMutationResult),
1216:    join: protectedProcedure
1218:      .mutation(() => unavailableMutationResult),
1225:    feed: protectedProcedure.query(
1241:    view: protectedProcedure
1243:      .mutation(() => unavailableMutationResult),
1244:    create: protectedProcedure
1253:      .mutation(() => unavailableMutationResult),
1258:    myOrders: protectedProcedure
1261:    getProducts: publicProcedure
1286:    getHot: publicProcedure.query(
1295:    listings: publicProcedure.input(z.object({}).optional()).query(
1308:    placeOrder: protectedProcedure
1318:        ...unavailableMutationResult,
1321:    create: protectedProcedure
1338:      .mutation(() => unavailableMutationResult),
1341:    list: publicProcedure.query(() => []),
1342:    get: publicProcedure.input(z.unknown().optional()).query(() => ({})),
1343:    subscribeWithStripe: protectedProcedure
1345:      .mutation(() => unavailableMutationResult),
1346:    analytics: protectedProcedure.query(() => ({
1352:    earnings: protectedProcedure.query(() => ({
1358:    fanScores: protectedProcedure.query(() => []),
1359:    milestones: protectedProcedure.query(() => []),
1360:    mySubscriptions: protectedProcedure.query(() => []),
1361:    myTips: protectedProcedure.query(() => []),
1362:    revenueForecasting: protectedProcedure.query(() => ({})),
1363:    tip: protectedProcedure
1365:      .mutation(() => unavailableMutationResult),
1368:    list: publicProcedure.query(() => []),
1369:    getReferralStats: protectedProcedure.query(() => ({
1378:    getReferralTree: protectedProcedure.query(() => ({
1381:    getMilestones: protectedProcedure.query(() => []),
1382:    getGrowthAdvice: protectedProcedure.query(() => ({
1391:    list: publicProcedure.query(() => []),
1392:    getPrints: publicProcedure.input(z.object({}).optional()).query(
1407:    getSeries: publicProcedure
1410:    checkout: protectedProcedure
1412:      .mutation(() => unavailableMutationResult),
1415:    createStripeCheckout: protectedProcedure
1425:        ...unavailableMutationResult,
1428:    createCheckout: protectedProcedure
1431:        ...unavailableMutationResult,
1434:    orderHistory: protectedProcedure.query(
1441:    stats: protectedProcedure.query(() => ({
1447:    pools: publicProcedure.query(
1459:    userPositions: protectedProcedure.query(
1471:    stake: protectedProcedure
1473:      .mutation(() => unavailableMutationResult),
1474:    claimRewards: protectedProcedure.mutation(() => unavailableMutationResult),
1477:    getBalance: protectedProcedure.query(() => ({
## Critical route classifications
client/src/pages/Login.tsx: IMPLEMENTED-SURFACE
client/src/pages/SignUpFlow.tsx: IMPLEMENTED-SURFACE
client/src/pages/Profile.tsx: TRUTHFULLY-GATED
client/src/pages/Wallet.tsx: IMPLEMENTED-SURFACE
client/src/pages/UnifiedWallet.tsx: TRUTHFULLY-GATED
client/src/pages/WalletOverview.tsx: TRUTHFULLY-GATED
client/src/pages/CryptoExchange.tsx: TRUTHFULLY-GATED
client/src/pages/Trading.tsx: TRUTHFULLY-GATED
client/src/pages/TradingTerminal.tsx: TRUTHFULLY-GATED
client/src/pages/HopeAIPage.tsx: IMPLEMENTED-SURFACE
client/src/pages/School.tsx: IMPLEMENTED-SURFACE
client/src/pages/AdminDashboard.tsx: IMPLEMENTED-SURFACE
client/src/pages/UserManagement.tsx: IMPLEMENTED-SURFACE
client/src/pages/RoleManagement.tsx: IMPLEMENTED-SURFACE
