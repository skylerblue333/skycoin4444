import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function DigitalTwin() {
  return (
    <FeatureUnavailable
      title="Digital Twin is not enabled yet"
      description="Personality scores, growth timelines, achievements, XP, relationship strengths, archetypes, and future probabilities require explicit consent, validated personal data, explainable models, uncertainty controls, and strong privacy safeguards. The current release does not fabricate an AI reflection or claim to predict a user's development or relationships."
      capability="Personal AI twin, growth insights, and future-path analysis"
      nextStep="Review the privacy and AI launch boundaries"
    />
  );
}
