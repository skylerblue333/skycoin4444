import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function RateLimitDashboard() {
  return (
    <FeatureUnavailable
      title="Rate-limit analytics are not enabled yet"
      description="Request volume, blocked requests, IP analytics, rule activation, abuse reports, and protection state require verified edge or server telemetry, privacy-safe aggregation, administrator authorization, and tested enforcement. The current release does not claim that rate limits are active or that a request was blocked."
      capability="Rate-limit configuration, abuse analytics, and enforcement evidence"
      nextStep="Review the security and infrastructure evidence boundaries"
    />
  );
}
