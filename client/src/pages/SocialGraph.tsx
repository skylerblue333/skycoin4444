import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function SocialGraph() {
  return (
    <FeatureUnavailable
      title="Social Graph is not enabled yet"
      description="Followers, following, suggested creators, relationship counts, recommendations, and follow actions require verified social persistence, consent, privacy controls, abuse prevention, and reliable authorization. The current release does not display synthetic network data or claim that a follow action was saved."
      capability="Community graph, recommendations, and relationship management"
      nextStep="Explore the launch hub"
    />
  );
}
