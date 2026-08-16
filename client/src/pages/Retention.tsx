import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Retention() {
  return (
    <FeatureUnavailable
      title="Retention & Loyalty is not enabled yet"
      description="Streaks, XP, badges, quests, loyalty tiers, token rewards, shields, and check-in activity require verified event persistence, anti-abuse controls, reward accounting, eligibility rules, and reconciliation. The current release does not claim that activity was recorded or that a reward, badge, or token balance was earned."
      capability="Engagement rewards, loyalty progression, quests, and retention analytics"
      nextStep="Explore the launch hub"
    />
  );
}
