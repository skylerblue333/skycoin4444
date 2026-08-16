import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function HopeAIPage() {
  return (
    <FeatureUnavailable
      title="HopeAI production capabilities are not active"
      description="AI mining optimization, trading automation, investment insights, security monitoring, and support require configured model providers, risk controls, user authorization, data retention policy, audit logging, and tested failure handling. This launch candidate does not claim those capabilities are live."
      capability="HopeAI production services"
      nextStep="Return to the launch hub"
    />
  );
}
