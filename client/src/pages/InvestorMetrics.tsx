import UnavailableFeature from "@/components/UnavailableFeature";

export default function InvestorMetricsPage() {
  return (
    <UnavailableFeature
      name="Investor metrics"
      reason="Platform analytics, valuation, token market cap, financial projections, revenue, retention, and runway are not sourced from verified telemetry or financial records. This static marketing surface is gated to prevent unsupported investor claims."
    />
  );
}
