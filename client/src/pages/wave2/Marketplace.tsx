import UnavailableFeature from "@/components/UnavailableFeature";

export default function MarketplacePage() {
  return (
    <UnavailableFeature
      name="Legacy marketplace page"
      reason="This duplicate Wave 2 page depends on the retired wave2Marketplace namespace. Use the canonical /marketplace page, which is the only production marketplace surface wired to the verified marketplace contract."
    />
  );
}
