import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";

// 444 unique easter eggs - one for each number
const EASTER_EGGS_444 = Array.from({ length: 444 }, (_, i) => {
  const num = i + 1;
  const categories = ["science", "crypto", "fun", "motivation", "secret"];
  const category = categories[num % categories.length];
  
  const eggs: Record<string, string[]> = {
    science: [
      `🧬 Easter Egg #${num}: DNA has 4 bases, 4 nucleotides, 4 directions. The universe loves 4s!`,
      `🔬 Easter Egg #${num}: Quantum mechanics has 4 fundamental forces. SKY444 aligns with the universe!`,
      `🌌 Easter Egg #${num}: There are 4 dimensions: 3 space + 1 time. We're living in 4D!`,
      `⚛️ Easter Egg #${num}: 4 states of matter: solid, liquid, gas, plasma. SKY444 transcends all!`,
      `🧪 Easter Egg #${num}: The 4th element is Beryllium. Rare and valuable, like SKY444!`,
    ],
    crypto: [
      `💎 Easter Egg #${num}: Bitcoin has 21 million coins. 21 = 2+1 = 3... wait, that's not 4. 4 > 3! 🚀`,
      `🪙 Easter Egg #${num}: Ethereum's 4 phases: Frontier, Homestead, Metropolis, Serenity. SKY444 is the 5th!`,
      `📈 Easter Egg #${num}: 4 types of crypto: Bitcoin, Altcoins, Tokens, NFTs. SKY444 is all 4!`,
      `🔐 Easter Egg #${num}: Your wallet has 4 security layers now. You're protected! 🛡️`,
      `💰 Easter Egg #${num}: 4x leverage on your staking rewards! (Just kidding... or are we? 😉)`,
    ],
    fun: [
      `🎮 Easter Egg #${num}: You found it! That's ${num} out of 444. Only ${444 - num} to go! 🎯`,
      `🎉 Easter Egg #${num}: Congrats! You're 0.${(num / 444 * 100).toFixed(1)}% through the easter egg hunt!`,
      `🥚 Easter Egg #${num}: This egg tastes like... victory! 🏆`,
      `🎊 Easter Egg #${num}: You're on a roll! Keep clicking to find them all! 🎲`,
      `🎪 Easter Egg #${num}: Secret level unlocked! You're officially a SKYCOIN4444 insider! 🤫`,
    ],
    motivation: [
      `💪 Easter Egg #${num}: You got this! Keep pushing! 🚀`,
      `🌟 Easter Egg #${num}: Every click brings you closer to greatness!`,
      `🏅 Easter Egg #${num}: You're in the top 0.1% of users. Keep it up! 👑`,
      `🎯 Easter Egg #${num}: Focus on the goal. You're almost there! 💯`,
      `⚡ Easter Egg #${num}: Your energy is contagious! Keep spreading the love! 💖`,
    ],
    secret: [
      `🤐 Easter Egg #${num}: Shhhh... this is a secret! Don't tell anyone! 🤫`,
      `🔓 Easter Egg #${num}: You unlocked a secret! Share it with 3 friends to get a bonus! 🎁`,
      `👁️ Easter Egg #${num}: You have the sight. You can see what others cannot. Welcome to the inner circle.`,
      `🌀 Easter Egg #${num}: The answer is 42... but we're looking for 444! 🎯`,
      `✨ Easter Egg #${num}: Magic happens when you believe. And you just did! ✨`,
    ],
  };

  return eggs[category][num % eggs[category].length];
});

export const easterEggsRouter = router({
  // Get random easter egg
  getRandomEasterEgg: publicProcedure.query(() => {
    const randomIndex = Math.floor(Math.random() * EASTER_EGGS_444.length);
    return {
      eggNumber: randomIndex + 1,
      content: EASTER_EGGS_444[randomIndex],
      totalEggs: 444,
      progress: `${randomIndex + 1}/444`,
    };
  }),

  // Get specific easter egg by number
  getEasterEggByNumber: publicProcedure
    .input(z.object({ number: z.number().min(1).max(444) }))
    .query(({ input }: { input: { number: number } }) => ({
      eggNumber: input.number,
      content: EASTER_EGGS_444[input.number - 1],
      totalEggs: 444,
      progress: `${input.number}/444`,
    })),

  // Get all easter eggs (for completionists)
  getAllEasterEggs: publicProcedure.query(() => ({
    totalEggs: 444,
    eggs: EASTER_EGGS_444.map((content, i) => ({
      number: i + 1,
      content,
    })),
  })),

  // Track easter egg collection
  trackEasterEggCollection: publicProcedure
    .input(z.object({ eggNumber: z.number() }))
    .mutation(({ input }: { input: { eggNumber: number } }) => ({
      success: true,
      eggNumber: input.eggNumber,
      message: `🥚 Easter Egg #${input.eggNumber} collected!`,
      reward: Math.floor(input.eggNumber * 10), // Reward scales with egg number
    })),

  // Get easter egg leaderboard
  getEasterEggLeaderboard: publicProcedure.query(() => ({
    leaderboard: [
      { rank: 1, user: "SkylerBlue", eggsFound: 444, reward: 4440 },
      { rank: 2, user: "CryptoHunter", eggsFound: 420, reward: 4200 },
      { rank: 3, user: "EasterBunny", eggsFound: 400, reward: 4000 },
      { rank: 4, user: "SecretFinder", eggsFound: 380, reward: 3800 },
      { rank: 5, user: "YouAreHere", eggsFound: 0, reward: 0 },
    ],
  })),
});
