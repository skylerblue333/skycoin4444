import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function MiningDashboard() {
  return (
    <FeatureUnavailable
      title="Mining is not active"
      description="Mining status, sessions, generated coins, rewards, crypto balances, and USD estimates require verified chain integration, device or pool authorization, accounting persistence, and monitoring. The release candidate does not simulate mining activity or earnings."
      capability="Mining activity, rewards, and financial estimates"
      nextStep="Return to the launch hub"
    />
  );
}
