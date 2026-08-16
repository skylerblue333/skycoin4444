import UnavailableFeature from "@/components/UnavailableFeature";

export default function MarketSentimentPage() {
  return (
    <UnavailableFeature
      name="Market sentiment"
      reason="Sentiment scores, market prices, volume, trading signals, confidence metrics, transaction statistics, and response-time telemetry are not connected to a verified market-data or analytics provider. This placeholder surface is gated so it cannot imply live investment signals."
    />
  );
}
