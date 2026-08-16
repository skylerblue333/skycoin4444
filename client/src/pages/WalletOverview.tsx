import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function WalletOverview() {
  return (
    <FeatureUnavailable
      title="Wallet Overview is not active"
      description="This route currently contains a generic placeholder rather than a verified product workflow. It remains visible for roadmap continuity until its backend contract, authorization, persistence, loading and error states, tests, and operational evidence are complete."
      capability="Wallet Overview"
      nextStep="Return to the launch hub"
    />
  );
}
