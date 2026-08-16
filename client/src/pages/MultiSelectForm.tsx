import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function MultiSelectForm() {
  return (
    <FeatureUnavailable
      title="Multi Select Form is not active"
      description="This route currently contains a generic placeholder rather than a verified product workflow. It remains visible for roadmap continuity until its backend contract, authorization, persistence, loading and error states, tests, and operational evidence are complete."
      capability="Multi Select Form"
      nextStep="Return to the launch hub"
    />
  );
}
