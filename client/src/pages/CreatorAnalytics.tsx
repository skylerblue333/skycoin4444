import UnavailableFeature from "@/components/UnavailableFeature";

export default function CreatorAnalytics() {
  return (
    <UnavailableFeature
      name="Creator Analytics"
      reason="Verified creator earnings, subscriptions, tips, engagement, retention, and revenue forecasting require authenticated persisted records and validated analytics contracts. The former route used randomized and hard-coded fallbacks, so it is gated until every metric is backend-backed and its empty, loading, and error states are verified."
    />
  );
}
