import UnavailableFeature from "@/components/UnavailableFeature";

export default function TokenDashboard() {
  return (
    <UnavailableFeature
      name="SKY444 token dashboard"
      reason="Verified token supply, allocation, staking, holder, and burn-history data are not connected to a production on-chain or audited backend integration."
    />
  );
}
