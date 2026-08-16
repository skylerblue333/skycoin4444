import UnavailableFeature from "@/components/UnavailableFeature";

export default function MegaMarketplacePage() {
  return (
    <UnavailableFeature
      name="Mega Marketplace"
      reason="Product pricing, discounts, ratings, sales counts, charity allocations, subscriptions, and checkout are not sourced from verified catalog, payment, or fulfillment records. This static commerce surface is gated to prevent unsupported marketplace claims."
    />
  );
}
