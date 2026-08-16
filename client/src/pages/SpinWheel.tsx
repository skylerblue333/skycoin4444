import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function SpinWheel() {
  return (
    <FeatureUnavailable
      title="Daily Spin Wheel is not enabled yet"
      description="Randomized rewards, prize odds, token or XP credits, badges, streak bonuses, wallet updates, and winner messages require verified game logic, responsible-gaming controls, eligibility rules, anti-abuse protections, auditable randomness, and durable reward settlement. The current release does not claim that a spin occurred or that a prize was awarded."
      capability="Daily rewards, randomized prizes, gamification, and reward settlement"
      nextStep="Explore the launch hub"
    />
  );
}
