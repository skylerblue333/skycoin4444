import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Marketplace() {
  return (
    <FeatureUnavailable
      title="Marketplace is not enabled yet"
      description="Listings, products, auctions, seller verification, escrow, checkout, delivery, refunds, and smart-contract settlement require a verified commerce provider, inventory and order persistence, payment reconciliation, dispute handling, and security review. The current release does not display mock products or claim that a purchase, auction, seller, escrow, or delivery is real."
      capability="Digital marketplace, commerce, auction, and fulfillment operations"
      nextStep="Explore the launch hub"
    />
  );
}
