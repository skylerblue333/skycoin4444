import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function DerivativeTrading() {
  return (
    <FeatureUnavailable
      title="Derivative Trading is not active"
      description="This route currently contains a generic placeholder rather than a verified product workflow. It remains visible for roadmap continuity until its backend contract, authorization, persistence, loading and error states, tests, and operational evidence are complete."
      capability="Derivative Trading"
      nextStep="Return to the launch hub"
    />
  );
}
