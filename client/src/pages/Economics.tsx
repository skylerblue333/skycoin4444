import UnavailableFeature from "@/components/UnavailableFeature";

export default function EconomicsPage() {
  return (
    <UnavailableFeature
      name="Token economics"
      reason="Token supply, burn and staking totals, holder counts, distribution percentages, and live price history are not sourced from verified chain and market records. This tokenomics surface is gated to prevent unsupported financial claims."
    />
  );
}
