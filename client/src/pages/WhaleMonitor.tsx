import UnavailableFeature from "@/components/UnavailableFeature";

export default function WhaleMonitorPage() {
  return (
    <UnavailableFeature
      name="Whale monitor"
      reason="Large-wallet detection, blockchain transaction feeds, token amounts, USD valuations, timing, market-impact classification, volume metrics, and auto-refresh telemetry are not verified end-to-end. This surface is gated so fabricated or randomly generated whale activity cannot be mistaken for market data."
    />
  );
}
