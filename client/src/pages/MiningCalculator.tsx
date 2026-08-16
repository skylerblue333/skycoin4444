import UnavailableFeature from "@/components/UnavailableFeature";

export default function MiningCalculatorPage() {
  return (
    <UnavailableFeature
      name="Mining calculator"
      reason="Mining profitability, network difficulty, coin prices, block rewards, ROI, and breakeven estimates are not sourced from verified live network and market integrations. This page is gated to prevent misleading financial projections."
    />
  );
}
