import FeatureUnavailable from "@/components/FeatureUnavailable";

export function StartupSection() {
  return (
    <FeatureUnavailable
      title="Startup Builder is not enabled yet"
      description="AI-generated business plans, branding, marketing plans, MVP roadmaps, team plans, and saved blueprints require a verified model provider, output validation, intellectual-property controls, user-owned persistence, and clear attribution. The current release does not claim that a business plan or strategy artifact was generated or saved."
      capability="AI startup planning and strategy generation"
      nextStep="Return to the launch hub"
    />
  );
}
