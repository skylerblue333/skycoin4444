import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CreatorDashboard() {
  return (
    <FeatureUnavailable
      title="Creator Dashboard is not enabled yet"
      description="Creator earnings, subscribers, tips, token rewards, marketplace sales, subscription tiers, payout settings, and revenue analytics require verified payment and attribution providers, creator-owned records, entitlement controls, reconciliation, tax handling, and privacy-safe reporting. The current release does not show generated balances or claim that a payment, subscriber relationship, tip, or payout exists."
      capability="Creator earnings, subscriptions, tips, payouts, and analytics"
      nextStep="Explore the launch hub"
    />
  );
}
