import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AIAgentMarket() {
  return (
    <FeatureUnavailable
      title="AI Agent Market is not active"
      description="The AI marketplace UI is preserved as a launch-hub boundary until agent execution, pricing, payment authorization, result delivery, usage accounting, and support workflows are connected to verified services."
      capability="AI marketplace purchases and agent execution"
      nextStep="Return to the launch hub"
    />
  );
}
