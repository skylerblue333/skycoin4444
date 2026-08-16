import UnavailableFeature from "@/components/UnavailableFeature";

export default function NFTWalletPage() {
  return (
    <UnavailableFeature
      name="NFT wallet"
      reason="Verified NFT ownership, metadata, collection indexing, valuations, wallet connection, signing, transfers, and marketplace settlement are not connected to production blockchain contracts. The current route is only a local placeholder, so it is gated rather than presenting unsupported NFT custody."
    />
  );
}
