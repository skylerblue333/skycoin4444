import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CheckboxGroupForm() {
  return (
    <FeatureUnavailable
      title="Checkbox Group Form is not active"
      description="This route currently contains a generic placeholder rather than a verified product workflow. It remains visible for roadmap continuity until its backend contract, authorization, persistence, loading and error states, tests, and operational evidence are complete."
      capability="Checkbox Group Form"
      nextStep="Return to the launch hub"
    />
  );
}
