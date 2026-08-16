import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Farming() {
  return (
    <FeatureUnavailable
      title="DeFi Farming and Launchpad are not enabled yet"
      description="Liquidity pools, APY, TVL, staking, token rewards, impermanent-loss protection, audits, launchpad projects, fundraising, participants, IDO allocations, and investment actions require verified smart contracts, oracle and indexer infrastructure, legal review, wallet transaction handling, and independently auditable records. The current release does not fabricate yield or claim that funds were staked, raised, or allocated."
      capability="Yield farming, staking, launchpad, and token investment"
      nextStep="Review the financial launch boundaries"
    />
  );
}
