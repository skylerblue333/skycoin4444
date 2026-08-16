import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function DigitalArtStore() {
  return (
    <FeatureUnavailable
      title="Digital Art Store is not enabled yet"
      description="Catalog listings, edition counts, certificates of authenticity, inventory, prices, media delivery, fulfillment, and checkout require verified commerce data, payment-provider configuration, tax and fulfillment handling, entitlement delivery, and reconciliation. The current release does not display synthetic products or claim that a purchase was completed."
      capability="Digital art catalog, commerce, checkout, and fulfillment"
      nextStep="Explore the launch hub"
    />
  );
}
