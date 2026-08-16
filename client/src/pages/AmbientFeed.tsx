import UnavailableFeature from "@/components/UnavailableFeature";

export default function AmbientFeed() {
  return (
    <UnavailableFeature
      name="Ambient Community Feed"
      reason="The former feed used static posts and fabricated engagement, sentiment, staking APY, treasury, governance, and ranking-model claims. A production feed requires authenticated persistence, moderation, ranking evidence, and truthful financial-content sourcing, so this surface is gated until those integrations are verified."
    />
  );
}
