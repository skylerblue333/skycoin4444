import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function TokenDashboard() {
  return (
    <FeatureUnavailable
      title="Token Dashboard is not enabled yet"
      description="Token supply, circulating supply, burns, allocation, staking, governance participation, holder counts, prices, and transaction history require an authoritative chain or ledger, verified contract addresses, indexer data, reconciliation, and audit evidence. The current release does not display hard-coded tokenomics or claim that a burn, holder count, or supply figure is real."
      capability="Token metrics, tokenomics, staking, governance, and burn history"
      nextStep="Explore the launch hub"
    />
  );
}
