import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ColorPickerDialog() {
  return (
    <FeatureUnavailable
      title="Color Picker Dialog is not active"
      description="This route currently contains a generic placeholder rather than a verified product workflow. It remains visible for roadmap continuity until its backend contract, authorization, persistence, loading and error states, tests, and operational evidence are complete."
      capability="Color Picker Dialog"
      nextStep="Return to the launch hub"
    />
  );
}
