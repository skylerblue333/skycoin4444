import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Gaming() {
  return (
    <FeatureUnavailable
      title="Gaming Hub is not enabled yet"
      description="Games, player counts, P2E status, tournaments, quests, season passes, leaderboards, XP, token prizes, and staking-linked rewards require verified game servers, anti-cheat controls, responsible-gaming safeguards, identity rules, and auditable reward settlement. The current release does not present simulated players or claim that a game, tournament, leaderboard result, or reward is live."
      capability="Gaming, play-to-earn, tournaments, leaderboards, and rewards"
      nextStep="Explore the launch hub"
    />
  );
}
