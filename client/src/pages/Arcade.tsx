import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Arcade() {
  return (
    <FeatureUnavailable
      title="Arcade and wagering are not enabled yet"
      description="Games, casino wagering, tournaments, player counts, prize pools, quests, XP, token rewards, leaderboards, and progression require verified game implementations, jurisdictional review, wallet or payment infrastructure, anti-fraud controls, randomness verification, and durable result settlement. The current release does not offer wagering or fabricate game outcomes and rewards."
      capability="Games, tournaments, quests, wagering, and rewards"
      nextStep="Explore the launch hub"
    />
  );
}
