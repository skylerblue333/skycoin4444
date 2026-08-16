import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CreatorAnalytics() {
  return (
    <FeatureUnavailable
      title="Creator Analytics is not enabled yet"
      description="Audience growth, views, engagement, revenue, subscriptions, tips, forecasts, fan rankings, creator milestones, and payout metrics require verified event instrumentation, privacy-safe aggregation, payment reconciliation, and durable creator-owned records. The current release does not render generated charts or claim creator earnings, performance, or audience outcomes."
      capability="Creator analytics, monetization reporting, forecasts, and audience intelligence"
      nextStep="Explore the launch hub"
    />
  );
}
