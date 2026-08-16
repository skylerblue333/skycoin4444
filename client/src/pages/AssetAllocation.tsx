import UnavailableFeature from "@/components/UnavailableFeature";

export default function AssetAllocationPage() {
  return (
    <UnavailableFeature
      name="Asset allocation"
      reason="Verified holdings, valuations, market prices, allocation analytics, risk calculations, recommendations, automation, and portfolio telemetry are not connected to a production data integration. The former page was a static shell with unsupported live-update and success claims, so it is gated rather than presented as real portfolio analysis."
    />
  );
}
