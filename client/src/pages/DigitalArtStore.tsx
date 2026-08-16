import UnavailableFeature from "@/components/UnavailableFeature";

export default function DigitalArtStorePage() {
  return (
    <UnavailableFeature
      name="Digital Art Store"
      reason="Art catalog pricing, edition scarcity, certificates of authenticity, ownership, and checkout are not connected to verified catalog, fulfillment, or payment records. The available checkout boundary is explicitly unavailable, so this storefront is gated."
    />
  );
}
