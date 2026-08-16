import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function HopeAI() {
  return (
    <FeatureUnavailable
      title="HopeAI is not enabled yet"
      description="Companion chat, emotional-state inference, gray-area analysis, risk scoring, therapeutic modes, coaching, memory, and message persistence require a verified model provider, sensitive-data governance, crisis and safety escalation, consent, retention controls, and human review. The current release does not claim to read emotions, diagnose risk, provide therapy, or keep private memory."
      capability="AI companion, sensitive emotional inference, and guided support"
      nextStep="Explore the launch hub"
    />
  );
}
