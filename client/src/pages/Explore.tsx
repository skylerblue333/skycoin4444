import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Explore() {
  return (
    <FeatureUnavailable
      title="Explore is not enabled yet"
      description="Trending content, live streams, viewer counts, creator recommendations, follows, popularity scores, and ecosystem availability require verified feed ranking, consent-aware analytics, content moderation, stream telemetry, and durable social services. The current release does not render generated creators, posts, viewer numbers, or live status as facts."
      capability="Discovery feeds, live content, trending intelligence, and creator recommendations"
      nextStep="Explore the launch hub"
    />
  );
}
