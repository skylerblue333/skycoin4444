import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function InvestmentGoals() {
  return (
    <FeatureUnavailable
      title="Investment Goals is not active"
      description="This route currently contains a generic placeholder rather than a verified product workflow. It remains visible for roadmap continuity until its backend contract, authorization, persistence, loading and error states, tests, and operational evidence are complete."
      capability="Investment Goals"
      nextStep="Return to the launch hub"
    />
  );
}
