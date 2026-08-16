import UnavailableFeature from "@/components/UnavailableFeature";

export default function TokenMetricsPage() {
  return (
    <UnavailableFeature
      name="Token metrics"
      reason="Verified token supply, circulation, price, market data, holder activity, burn history, transaction statistics, and real-time telemetry are not connected to production on-chain or audited data sources. This placeholder is gated so it cannot imply live token metrics."
    />
  );
}
