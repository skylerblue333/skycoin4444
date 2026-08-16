import UnavailableFeature from "@/components/UnavailableFeature";

export default function SystemObservabilityPage() {
  return (
    <UnavailableFeature
      name="System observability"
      reason="Production logs, traces, metrics, event streams, latency percentiles, error timelines, wallet activity, payment events, and incident status are not connected to an auditable observability backend. The former page used static and randomized telemetry, including fabricated payment and wallet events, so it is gated rather than presenting synthetic monitoring as live production evidence."
    />
  );
}
