import UnavailableFeature from "@/components/UnavailableFeature";

export default function OrderBookPage() {
  return (
    <UnavailableFeature
      name="Order book"
      reason="Live bids, asks, depth, pricing, order matching, transaction history, and exchange telemetry are not verified end-to-end. This placeholder order-book surface is gated so it cannot imply real market data or trading functionality."
    />
  );
}
