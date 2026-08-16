import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CommunityCreate() {
  return (
    <FeatureUnavailable
      title="Community creation is not enabled yet"
      description="Creating public, private, token-gated, or premium communities requires verified identity, slug and ownership controls, moderation tooling, access policy enforcement, token-gating infrastructure, billing, privacy terms, and durable persistence. The current release does not claim that a community was created or that access controls are active."
      capability="Community creation, membership, token gating, and premium access"
      nextStep="Explore the launch hub"
    />
  );
}
