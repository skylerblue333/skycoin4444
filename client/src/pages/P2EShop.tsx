import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function P2EShop() {
  return (
    <FeatureUnavailable
      title="P2E Shop is not enabled yet"
      description="Item catalogs, prices, scarcity, wallet balances, NFT ownership, purchases, inventory, and in-game reward effects require verified commerce and wallet infrastructure, inventory persistence, payment or token settlement, and auditable delivery. The current release does not fabricate items or claim that a purchase succeeded."
      capability="Play-to-earn shop, token purchases, NFTs, and inventory"
      nextStep="Review the commerce and financial launch boundaries"
    />
  );
}
