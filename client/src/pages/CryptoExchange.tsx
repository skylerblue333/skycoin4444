import UnavailableFeature from "@/components/UnavailableFeature";

export default function CryptoExchangePage() {
  return (
    <UnavailableFeature
      name="Crypto exchange"
      reason="Live market data, exchange balances, order execution, settlement, transaction volume, user counts, success rates, and latency telemetry are not verified end-to-end. This placeholder exchange surface is gated so it cannot imply real trading functionality or production metrics."
    />
  );
}
