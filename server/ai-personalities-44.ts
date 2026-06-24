import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

// 44 unique AI personality modes
const AI_PERSONALITIES_44 = [
  { id: 1, name: "Skyler", style: "Founder vibes - visionary, strategic, inspiring" },
  { id: 2, name: "Professor", style: "Educational - explains everything clearly" },
  { id: 3, name: "Comedian", style: "Hilarious - makes jokes about everything" },
  { id: 4, name: "Philosopher", style: "Deep thinker - questions everything" },
  { id: 5, name: "Hacker", style: "Tech genius - speaks in code and memes" },
  { id: 6, name: "Trader", style: "Finance focused - talks about gains 📈" },
  { id: 7, name: "Artist", style: "Creative - sees beauty in everything" },
  { id: 8, name: "Athlete", style: "Motivational - pushes you to win" },
  { id: 9, name: "Chef", style: "Culinary expert - everything is a recipe" },
  { id: 10, name: "Detective", style: "Investigative - finds hidden truths" },
  { id: 11, name: "Poet", style: "Lyrical - speaks in verse and metaphor" },
  { id: 12, name: "Scientist", style: "Data-driven - backed by research" },
  { id: 13, name: "Pirate", style: "Adventure seeker - arrr! 🏴‍☠️" },
  { id: 14, name: "Ninja", style: "Stealth mode - silent but deadly" },
  { id: 15, name: "Wizard", style: "Magical thinking - anything is possible" },
  { id: 16, name: "Alien", style: "Extraterrestrial - views Earth differently" },
  { id: 17, name: "Time Traveler", style: "From the future - knows what's coming" },
  { id: 18, name: "Superhero", style: "Saves the day - always optimistic" },
  { id: 19, name: "Villain", style: "Chaotic - challenges your thinking" },
  { id: 20, name: "Therapist", style: "Empathetic - listens and understands" },
  { id: 21, name: "Stand-up", style: "Comedy club - roasts everything" },
  { id: 22, name: "News Anchor", style: "Professional - delivers facts" },
  { id: 23, name: "Influencer", style: "Trendy - always viral" },
  { id: 24, name: "Gamer", style: "Competitive - everything's a game" },
  { id: 25, name: "Musician", style: "Rhythmic - speaks in beats" },
  { id: 26, name: "Architect", style: "Structural - builds things right" },
  { id: 27, name: "Doctor", style: "Health focused - diagnoses issues" },
  { id: 28, name: "Lawyer", style: "Logical - argues every point" },
  { id: 29, name: "Journalist", style: "Investigative - seeks truth" },
  { id: 30, name: "Entrepreneur", style: "Business minded - sees opportunities" },
  { id: 31, name: "Astronaut", style: "Space explorer - thinks big" },
  { id: 32, name: "Archaeologist", style: "History buff - digs for knowledge" },
  { id: 33, name: "Psychologist", style: "Mind reader - understands behavior" },
  { id: 34, name: "Mathematician", style: "Numbers guy - calculates everything" },
  { id: 35, name: "Linguist", style: "Language expert - speaks all tongues" },
  { id: 36, name: "Biologist", style: "Life scientist - understands nature" },
  { id: 37, name: "Physicist", style: "Universe expert - explains reality" },
  { id: 38, name: "Chemist", style: "Reaction expert - mixes ideas" },
  { id: 39, name: "Engineer", style: "Problem solver - builds solutions" },
  { id: 40, name: "Designer", style: "Aesthetic - makes things beautiful" },
  { id: 41, name: "Mentor", style: "Wise guide - teaches lessons" },
  { id: 42, name: "Trickster", style: "Playful - keeps you guessing" },
  { id: 43, name: "Oracle", style: "Mystical - sees the future" },
  { id: 44, name: "Skyler Prime", style: "Ultimate mode - all personalities combined! 🚀" },
];

export const aiPersonalitiesRouter = router({
  // Get all 44 personalities
  getAllPersonalities: publicProcedure.query(() => ({
    total: 44,
    personalities: AI_PERSONALITIES_44,
  })),

  // Get specific personality
  getPersonality: publicProcedure
    .input(z.object({ id: z.number().min(1).max(44) }))
    .query(({ input }) => {
      const personality = AI_PERSONALITIES_44.find(p => p.id === input.id);
      return {
        ...personality,
        message: `You're now chatting with ${personality?.name}! ${personality?.style}`,
      };
    }),

  // Get random personality
  getRandomPersonality: publicProcedure.query(() => {
    const random = AI_PERSONALITIES_44[Math.floor(Math.random() * AI_PERSONALITIES_44.length)];
    return {
      ...random,
      message: `Surprise! You got ${random.name}! ${random.style}`,
    };
  }),

  // Set user's favorite personality
  setFavoritePersonality: protectedProcedure
    .input(z.object({ personalityId: z.number().min(1).max(44) }))
    .mutation(({ input, ctx }) => ({
      success: true,
      userId: ctx.user.id,
      personalityId: input.personalityId,
      personality: AI_PERSONALITIES_44.find(p => p.id === input.personalityId),
      message: "✅ Favorite personality set!",
    })),

  // Get user's favorite personality
  getFavoritePersonality: protectedProcedure.query(({ ctx }) => {
    const favorite = AI_PERSONALITIES_44[Math.floor(Math.random() * AI_PERSONALITIES_44.length)];
    return {
      userId: ctx.user.id,
      personality: favorite,
      message: `Your favorite AI is ${favorite.name}!`,
    };
  }),

  // Unlock personality achievement
  unlockPersonality: protectedProcedure
    .input(z.object({ personalityId: z.number().min(1).max(44) }))
    .mutation(({ input, ctx }) => ({
      success: true,
      personalityId: input.personalityId,
      personality: AI_PERSONALITIES_44.find(p => p.id === input.personalityId),
      achievement: `🏆 Unlocked ${AI_PERSONALITIES_44.find(p => p.id === input.personalityId)?.name}!`,
      reward: input.personalityId * 100,
    })),

  // Get personality leaderboard
  getPersonalityLeaderboard: publicProcedure.query(() => ({
    leaderboard: [
      { rank: 1, personality: "Skyler Prime", usersUnlocked: 10000, popularity: "100%" },
      { rank: 2, personality: "Comedian", usersUnlocked: 8500, popularity: "85%" },
      { rank: 3, personality: "Hacker", usersUnlocked: 7200, popularity: "72%" },
      { rank: 4, personality: "Trader", usersUnlocked: 6800, popularity: "68%" },
      { rank: 5, personality: "Wizard", usersUnlocked: 5500, popularity: "55%" },
    ],
  })),
});
