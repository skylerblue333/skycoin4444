import UnavailableFeature from "@/components/UnavailableFeature";

export default function ArbitrageBotPage() {
  return (
    <UnavailableFeature
      name="Arbitrage bot"
      reason="Verified exchange connectivity, market-data feeds, opportunity detection, risk controls, wallet authorization, trade execution, settlement, and bot telemetry are not connected to production. The former page used unsupported automation and performance claims, so it is gated rather than presenting an executable arbitrage system."
    />
  );
}
