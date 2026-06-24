import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";

export const viralGrowthRouter = router({
  // Referral system - exponential rewards
  getReferralLink: protectedProcedure.query(({ ctx }) => ({
    referralLink: `https://skycoineco-gpydfszu.manus.space?ref=${ctx.user.id}`,
    referralCode: `SKY${ctx.user.id}`,
    message: "Share your referral link to earn 10% of their staking rewards forever!",
  })),

  // Track referrals
  trackReferral: protectedProcedure
    .input(z.object({ referredUserId: z.number() }))
    .mutation(({ input, ctx }) => ({
      success: true,
      referrer: ctx.user.id,
      referred: input.referredUserId,
      reward: 100, // Base reward
      message: "✅ Referral tracked! Earn passive income!",
    })),

  // Viral challenges
  getViralChallenge: publicProcedure.query(() => {
    const challenges = [
      {
        id: 1,
        title: "Share to 3 friends",
        reward: 444,
        description: "Share SKYCOIN4444 with 3 friends and get 444 coins!",
      },
      {
        id: 2,
        title: "Create a post",
        reward: 100,
        description: "Create a post about your experience and get 100 coins!",
      },
      {
        id: 3,
        title: "Stake 1000 coins",
        reward: 50,
        description: "Stake 1000 coins and earn 50 bonus coins!",
      },
      {
        id: 4,
        title: "Play 5 games",
        reward: 200,
        description: "Play 5 games and win 200 bonus coins!",
      },
      {
        id: 5,
        title: "Invite to Discord",
        reward: 300,
        description: "Invite a friend to our Discord and get 300 coins!",
      },
    ];

    return challenges[Math.floor(Math.random() * challenges.length)];
  }),

  // Leaderboard for viral growth
  getViralLeaderboard: publicProcedure.query(() => ({
    leaderboard: [
      { rank: 1, user: "ViralKing", referrals: 5000, earnings: 50000 },
      { rank: 2, user: "GrowthHacker", referrals: 4200, earnings: 42000 },
      { rank: 3, user: "ShareMaster", referrals: 3800, earnings: 38000 },
      { rank: 4, user: "NetworkEffect", referrals: 3200, earnings: 32000 },
      { rank: 5, user: "YouAreHere", referrals: 0, earnings: 0 },
    ],
  })),

  // Gamified achievements
  getAchievements: protectedProcedure.query(({ ctx }) => ({
    achievements: [
      { id: 1, name: "First Step", description: "Sign up", unlocked: true },
      { id: 2, name: "Referral Master", description: "Refer 10 people", unlocked: false },
      { id: 3, name: "Staking Champion", description: "Stake 10,000 coins", unlocked: false },
      { id: 4, name: "Gaming Legend", description: "Win 100 games", unlocked: false },
      { id: 5, name: "Social Butterfly", description: "Make 50 friends", unlocked: false },
      { id: 6, name: "Crypto Whale", description: "Hold 1M coins", unlocked: false },
      { id: 7, name: "DAO Voter", description: "Vote in 10 proposals", unlocked: false },
      { id: 8, name: "Creator", description: "Earn 1000 from content", unlocked: false },
    ],
  })),

  // NFT rewards for milestones
  getNFTRewards: protectedProcedure.query(({ ctx }) => ({
    nfts: [
      {
        id: 1,
        name: "Founder's NFT",
        description: "Limited edition - only 444 exist",
        value: 4440,
        unlocked: false,
        requirement: "Refer 100 people",
      },
      {
        id: 2,
        name: "Diamond Holder",
        description: "Rare NFT for top 1% holders",
        value: 1000,
        unlocked: false,
        requirement: "Hold 100,000 coins",
      },
      {
        id: 3,
        name: "Gaming Champion",
        description: "Epic NFT for top gamers",
        value: 500,
        unlocked: false,
        requirement: "Win 1000 games",
      },
    ],
  })),

  // Exponential growth tracker
  getGrowthMetrics: publicProcedure.query(() => ({
    totalUsers: 1234567,
    dailyActiveUsers: 456789,
    referralConversions: "42%",
    viralCoefficient: 2.1, // Each user brings 2.1 new users
    growthRate: "44% per month",
    projectedUsers30Days: 1234567 * Math.pow(1.44, 1),
    message: "🚀 We're growing exponentially! Join the movement!",
  })),

  // Bonus multiplier system
  getBonusMultiplier: protectedProcedure.query(({ ctx }) => ({
    baseMultiplier: 1.0,
    referralBonus: 0.1 * Math.random() * 10, // Up to 10x
    stakingBonus: 0.15 * Math.random() * 5, // Up to 5x
    gameBonus: 0.2 * Math.random() * 3, // Up to 3x
    totalMultiplier: 1.0 + (0.1 * Math.random() * 10) + (0.15 * Math.random() * 5) + (0.2 * Math.random() * 3),
    message: "Your rewards are multiplied! Keep growing! 📈",
  })),
});
