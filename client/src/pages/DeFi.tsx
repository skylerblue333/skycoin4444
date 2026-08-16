import UnavailableFeature from "@/components/UnavailableFeature";

export default function DeFiPage() {
  return (
    <UnavailableFeature
      name="DeFi hub"
      reason="Verified swap, lending, liquidity-pool, farming, bridge, vault, and derivatives contracts are not connected to production. TVL, APY, volume, risk, liquidity, balance, and cross-chain claims are therefore not authoritative. The former hub used static financial data and exposed unsupported action links, so it is gated until audited integrations and transaction reconciliation exist."
    />
  );
}
