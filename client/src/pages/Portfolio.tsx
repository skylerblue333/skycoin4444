import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Portfolio() {
  return (
    <FeatureUnavailable
      title="Portfolio data is not connected"
      description="Portfolio holdings, balances, prices, performance history, and asset actions are unavailable until authenticated wallet data, verified market feeds, ledger persistence, and transaction monitoring are connected. No balances or financial performance are shown as fact in this release candidate."
      capability="Portfolio balances, market prices, performance, and asset actions"
      nextStep="Return to the launch hub"
    />
  );
}
