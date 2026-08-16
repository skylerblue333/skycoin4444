import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function StakingPortal() {
  return (
    <FeatureUnavailable
      title="Staking is not enabled yet"
      description="Pool balances, APY, reward projections, participant counts, audits, lock periods, and reward claims require a verified ledger and provider integration. The current release intentionally does not show synthetic staking metrics or imply that rewards, custody, or audits are active."
      capability="Token staking, rewards, and locked-balance operations"
      nextStep="Explore the launch hub"
    />
  );
}
