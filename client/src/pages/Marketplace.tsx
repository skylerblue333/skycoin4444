import UnavailableFeature from "@/components/UnavailableFeature";

export default function MarketplacePage() {
  return (
    <UnavailableFeature
      name="Marketplace"
      reason="Verified listings, inventory, seller data, pricing, ratings, order placement, payment settlement, shipping, refunds, and purchase history are not connected to a production commerce integration. The existing checkout UI is gated so it cannot claim an order was placed or present unsupported financial totals."
    />
  );
}
