import UnavailableFeature from "@/components/UnavailableFeature";

export default function CryptoHubPage() {
  return (
    <UnavailableFeature
      name="Crypto Hub"
      reason="User balance and transaction reads exist, but live market pricing is unavailable and mining, swap, stake, and burn mutations are explicitly unavailable. This mixed financial surface is gated until complete verified wallet, market, and transaction workflows are connected."
    />
  );
}
