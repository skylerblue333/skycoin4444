import UnavailableFeature from "@/components/UnavailableFeature";

export default function UnifiedPlatformDashboardPage() {
  return (
    <UnavailableFeature
      name="Unified platform dashboard"
      reason="Verified ecosystem activity, user counts, translation accuracy, teacher sessions, milestones, API latency, uptime, and database health are not connected to production observability or authoritative business telemetry. The former dashboard used mock activity data and static operational percentages, so it is gated rather than implying verified platform performance."
    />
  );
}
