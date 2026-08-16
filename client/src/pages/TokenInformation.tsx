import UnavailableFeature from "@/components/UnavailableFeature";

export default function TokenInformationPage() {
  return (
    <UnavailableFeature
      name="Token information"
      reason="Token supply, allocation, contract addresses, price, holder data, utility, governance rights, and on-chain status are not verified against authoritative production contracts or data providers. This route remains gated until those sources are available and auditable."
    />
  );
}
