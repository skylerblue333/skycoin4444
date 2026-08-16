import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AIPersonaSystem() {
  return (
    <FeatureUnavailable
      title="AI Persona System"
      description="The living-world simulation is not enabled in the current release. Autonomous personas, relationships, follower counts, and generated activity require explicit consent, model provenance, moderation, audit logs, and a verified persistence layer before they can appear as an active product capability."
      capability="Autonomous persona behavior and simulated social activity"
      nextStep="Explore the launch hub"
    />
  );
}
