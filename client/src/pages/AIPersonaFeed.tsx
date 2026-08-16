import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AIPersonaFeed() {
  return (
    <FeatureUnavailable
      title="AI Persona Feed"
      description="The persona feed is reserved for a verified AI-content pipeline with moderation, provenance, user consent, and persistent activity records. The current application does not claim that autonomous personas or generated community posts are active."
      capability="Autonomous persona generation and feed activity"
      nextStep="Explore the launch hub"
    />
  );
}
