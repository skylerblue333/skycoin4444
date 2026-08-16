import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ScalableAnalytics() {
  return (
    <FeatureUnavailable
      title="Enterprise Analytics is not enabled yet"
      description="DAU, retention, revenue, burn, treasury, token velocity, supply, threat counts, and AI-agent performance require verified event instrumentation, privacy-safe aggregation, financial reconciliation, security telemetry, and an operational analytics pipeline. The current release does not render generated charts or claim production metrics, customers, revenue, or agent success rates."
      capability="Enterprise analytics, business intelligence, security metrics, and performance reporting"
      nextStep="Explore the launch hub"
    />
  );
}
