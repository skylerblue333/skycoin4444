import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AICopyStudio() {
  return (
    <FeatureUnavailable
      title="AI Copy Studio is not enabled yet"
      description="Copy generation, improvement, analysis, translation, templates, and conversion scoring require a verified model provider, prompt and data controls, content-safety review, usage limits, and persistent history. The current release does not claim generated copy or marketing performance."
      capability="AI content generation, translation, and copy analytics"
      nextStep="Explore the launch hub"
    />
  );
}
