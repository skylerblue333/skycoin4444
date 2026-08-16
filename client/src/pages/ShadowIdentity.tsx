import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ShadowIdentity() {
  return (
    <FeatureUnavailable
      title="Shadow Identity is not enabled yet"
      description="Anonymous modes, identity reveal controls, reputation scores, AI analysis, and public leaderboards require a verified identity model, privacy threat assessment, access controls, abuse prevention, and durable audit records. The current release does not claim anonymity, identity protection, or reputation accuracy."
      capability="Privacy-preserving identity and reputation management"
      nextStep="Explore the launch hub"
    />
  );
}
