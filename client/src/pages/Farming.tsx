import UnavailableFeature from "@/components/UnavailableFeature";

export default function FarmingPage() {
  return (
    <UnavailableFeature
      name="Farming and launchpad"
      reason="APY, TVL, token rewards, launchpad allocations, and farming/participation settlement are not sourced from verified DeFi contracts. This page is gated to prevent unsupported yield and investment claims."
    />
  );
}
