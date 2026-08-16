import UnavailableFeature from "@/components/UnavailableFeature";

export default function AgentDetailPage() {
  return (
    <UnavailableFeature
      name="Agent detail"
      reason="Agent status, task counts, uptime, market signals, recent activity, and user notifications are not sourced from a verified agent runtime or telemetry system. This static detail page is gated to prevent fabricated operational claims."
    />
  );
}
