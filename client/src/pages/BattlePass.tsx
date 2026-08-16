import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function BattlePass() {
  return (
    <FeatureUnavailable
      title="Battle Pass is not enabled yet"
      description="Season tiers, XP, premium access, badges, token rewards, progression, and reward claims require verified gamification records, entitlement controls, payment infrastructure, and durable reward settlement. The current release does not fabricate levels or claim that a reward, badge, premium upgrade, or token distribution succeeded."
      capability="Battle Pass progression, premium rewards, and claims"
      nextStep="Review the rewards and commerce launch boundaries"
    />
  );
}
