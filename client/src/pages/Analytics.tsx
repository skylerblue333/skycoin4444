import UnavailableFeature from "@/components/UnavailableFeature";

export default function AnalyticsPage() {
  return (
    <UnavailableFeature
      name="Analytics dashboard"
      reason="DAU, MAU, revenue, page views, content performance, and growth trends are not sourced from verified telemetry or accounting records. This static dashboard is gated to prevent unsupported platform and financial metrics."
    />
  );
}
