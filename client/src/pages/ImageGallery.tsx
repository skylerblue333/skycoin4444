import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ImageGallery() {
  return (
    <FeatureUnavailable
      title="Image Gallery is not active"
      description="This route currently contains a generic placeholder rather than a verified product workflow. It remains visible for roadmap continuity until its backend contract, authorization, persistence, loading and error states, tests, and operational evidence are complete."
      capability="Image Gallery"
      nextStep="Return to the launch hub"
    />
  );
}
