import UnavailableFeature from "@/components/UnavailableFeature";

export default function CryptoResearchHubPage() {
  return (
    <UnavailableFeature
      name="Crypto research hub"
      reason="Authoritative market prices, market capitalization, volume, historical candles, mining-pool telemetry, staking yields, and research methodology are not connected to verified data providers. The former route generated mock price history and static financial metrics, so it is gated rather than presenting unsupported market intelligence or investment claims."
    />
  );
}
