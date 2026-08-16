import UnavailableFeature from "@/components/UnavailableFeature";

export default function EscrowShopPage() {
  return (
    <UnavailableFeature
      name="Escrow Shop"
      reason="Secure escrow custody, token-denominated pricing, and settlement are not connected to a verified production integration. This route is gated to prevent unsupported commerce or payment claims."
    />
  );
}
