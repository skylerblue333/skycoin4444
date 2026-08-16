import UnavailableFeature from "@/components/UnavailableFeature";

export default function P2EShopPage() {
  return (
    <UnavailableFeature
      name="P2E Shop"
      reason="Token-priced items, NFT drops, inventory limits, and purchase settlement are not connected to a verified GameFi or wallet transaction contract. This route is gated to prevent simulated purchases and fabricated digital-asset claims."
    />
  );
}
