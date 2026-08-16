import UnavailableFeature from "@/components/UnavailableFeature";

export default function SKY444CentralBankPage() {
  return (
    <UnavailableFeature
      name="SKY444 Central Bank"
      reason="Token supplies, circulating balances, staking APY, treasury reserves, and economic health metrics are not sourced from verified chain, treasury, or accounting records. This dashboard is gated to prevent unsupported reserve and monetary claims."
    />
  );
}
