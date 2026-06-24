import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { db } from "./db";
import { transactions, wallets } from "../drizzle/schema";

// Funny error messages for users without cards
const BROKE_BOY_MESSAGES = [
  "Broke boy detected 🚨 - Get a card first!",
  "Your wallet is emptier than a crypto bear market 📉",
  "No card? No ICO coins! It's that simple 💳",
  "You're one card away from being rich 💰",
  "Looks like someone forgot their credit card at home 🏠",
  "ICO coins only for card holders! Get one and come back 🎫",
  "Your bank account is on vacation 🏖️",
  "Broke? Don't worry, everyone starts somewhere! 💪",
  "This feature requires a card. You know, the plastic thing? 💳",
  "Oops! Looks like you're financially challenged 😅",
];

// Easter eggs
const EASTER_EGGS = [
  "🎮 Did you know? SKYCOIN4444 was built by aliens from the future!",
  "🚀 Fun fact: Every transaction sends a message to the moon 🌙",
  "💎 Secret: Hodl for 100 years and become a crypto billionaire!",
  "🤖 AI Fact: Our AI agents dream in blockchain 💭",
  "🎯 Achievement Unlocked: You found the easter egg! 🥚",
];

export const icoRouter = router({
  // Get ICO status
  getICOStatus: publicProcedure.query(async () => ({
    active: true,
    tokensAvailable: 1000000,
    tokensSold: 234567,
    pricePerToken: 0.001,
    totalRaised: 234.567,
    daysRemaining: 45,
    participants: 12345,
    softCap: 50000,
    hardCap: 500000,
  })),

  // Purchase ICO coins (requires card)
  purchaseICOCoins: protectedProcedure
    .input(z.object({ 
      amount: z.number().positive(),
      cardId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user has a card attached
      const hasCard = input.cardId || Math.random() > 0.5; // Simulate card check
      
      if (!hasCard) {
        const randomMessage = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
        return {
          success: false,
          error: BROKE_BOY_MESSAGES[Math.floor(Math.random() * BROKE_BOY_MESSAGES.length)],
          easterEgg: randomMessage,
          code: "NO_CARD",
        };
      }

      // Process payment
      const costUSD = input.amount * 0.001;
      const transactionId = `ico-${Date.now()}`;

      // Simulate payment processing
      return {
        success: true,
        transactionId,
        coinsReceived: input.amount,
        costUSD,
        message: `🎉 Congratulations! You're now a SKY444 holder! 🚀`,
        easterEgg: EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)],
      }
    }),

  // Get user ICO purchases
  getUserICOPurchases: protectedProcedure.query(async ({ ctx }) => ({
    totalSpent: 234.56,
    totalCoins: 234560,
    purchases: [
      {
        id: "ico-1",
        amount: 100000,
        costUSD: 100,
        date: new Date(),
        status: "completed",
      },
      {
        id: "ico-2",
        amount: 134560,
        costUSD: 134.56,
        date: new Date(),
        status: "completed",
      },
    ],
  })),

  // Add payment card for ICO
  addPaymentCard: protectedProcedure
    .input(z.object({
      cardNumber: z.string(),
      expiryDate: z.string(),
      cvv: z.string(),
      cardholderName: z.string(),
    }))
    .mutation(async ({ input, ctx }) => ({
      success: true,
      cardId: `card-${Date.now()}`,
      last4: input.cardNumber.slice(-4),
      message: "✅ Card added successfully! Now you can buy ICO coins! 💳",
      easterEgg: "🎊 Welcome to the rich club! 💰",
    })),

  // Get user payment methods
  getPaymentMethods: protectedProcedure.query(async ({ ctx }) => ({
    cards: [
      {
        id: "card-1",
        last4: "4242",
        brand: "Visa",
        expiryDate: "12/25",
        isDefault: true,
      },
    ],
    hasCards: true,
  })),

  // Trigger AI auto-posting
  triggerAIAutoPost: protectedProcedure
    .input(z.object({ category: z.enum(["science", "engineering", "fun", "crypto"]) }))
    .mutation(async ({ input, ctx }) => {
      const posts = {
        science: [
          "🧬 Did you know? Quantum computers could revolutionize blockchain security! The future is here! #QuantumComputing #Blockchain",
          "🔬 Scientists just discovered a new way to optimize AI models using neural networks inspired by the human brain! Mind = Blown 🤯 #AI #Science",
          "🌌 The universe is expanding faster than we thought! Imagine what this means for space-based crypto mining! 🚀 #Physics #Innovation",
          "💡 Breakthrough: New protein folding algorithm could accelerate drug discovery! Science is amazing! 🧪 #Biotech #Innovation",
        ],
        engineering: [
          "⚙️ Just optimized our backend infrastructure to handle 10x more transactions! Engineering excellence at its finest! 💪 #Engineering #TechStack",
          "🛠️ Building scalable systems is an art form. Today we reduced latency by 60%! Performance matters! ⚡ #DevOps #Infrastructure",
          "🏗️ New microservices architecture deployed! Our platform is now bulletproof! 🔒 #SoftwareEngineering #Architecture",
          "🔧 Implemented zero-downtime deployment system. Your service never stops! 🚀 #DevOps #Reliability",
        ],
        fun: [
          "🎮 Just beat my high score in crypto mining! Who wants to challenge me? 🏆 #Gaming #Competitive",
          "😂 My AI agent just made a joke that was actually funny! We're getting closer to AGI! 🤖 #AI #Humor",
          "🎉 SKYCOIN4444 just hit 1 million users! We're unstoppable! 🚀 #Milestone #Community",
          "🎊 Celebrating another day of zero downtime! Our engineers deserve a raise! 💰 #TeamWork #Excellence",
        ],
        crypto: [
          "📈 Bitcoin just hit a new all-time high! The bull market is real! 🐂 #Crypto #Bitcoin",
          "🪙 Just staked 10,000 SKY444 tokens and earning 25% APY! Passive income is beautiful! 💰 #Staking #DeFi",
          "🔐 Security audit passed with flying colors! Your funds are safe with us! 🛡️ #Security #Trust",
          "💎 New tokenomics model released! Better rewards for holders! 🚀 #Tokenomics #Community",
        ],
      };

      const categoryPosts = posts[input.category];
      const randomPost = categoryPosts[Math.floor(Math.random() * categoryPosts.length)];

      return {
        success: true,
        postId: `post-${Date.now()}`,
        content: randomPost,
        category: input.category,
        timestamp: new Date(),
        message: "✅ AI post created and shared! 📱",
      };
    }),

  // Get AI-generated posts
  getAIGeneratedPosts: publicProcedure.query(async () => ({
    posts: [
      {
        id: "post-1",
        content: "🚀 Just deployed a new feature that will blow your mind! #Innovation #Tech",
        category: "engineering",
        timestamp: new Date(),
        likes: 1234,
        comments: 567,
      },
      {
        id: "post-2",
        content: "🧬 Quantum computing breakthrough! The future of AI is here! #Science #Innovation",
        category: "science",
        timestamp: new Date(),
        likes: 2345,
        comments: 890,
      },
      {
        id: "post-3",
        content: "😂 My AI just told a joke that was actually funny! 🤖 #AI #Humor",
        category: "fun",
        timestamp: new Date(),
        likes: 3456,
        comments: 1234,
      },
    ],
  })),

  // Easter egg trigger
  triggerEasterEgg: publicProcedure.query(async () => ({
    easterEgg: EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)],
    message: "🥚 You found an easter egg!",
  })),
});
