import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CreatorProfile() {
  return (
    <FeatureUnavailable
      title="Creator Profiles are not enabled yet"
      description="Creator identity, audience counts, posts, likes, subscriptions, paid tiers, locked media, follow state, and checkout require verified creator records, consent-aware social data, content access control, payment-provider configuration, tax handling, and durable entitlement persistence. The current release does not render a mock creator or claim that a subscription, follow, payment, or content unlock succeeded."
      capability="Creator profiles, subscriptions, paid content, and audience commerce"
      nextStep="Explore the launch hub"
    />
  );
}
