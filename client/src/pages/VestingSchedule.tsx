import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function VestingSchedule() {
  return (
    <FeatureUnavailable
      title="Token Vesting is not enabled yet"
      description="Token supply, allocations, cliffs, unlock schedules, circulating balances, personal vesting positions, and claim transactions require verified token contracts, custodial or wallet infrastructure, on-chain reconciliation, and auditable transaction status. The current release does not fabricate token balances or claim that a vesting transaction succeeded."
      capability="Token vesting schedules, balances, and claims"
      nextStep="Review the financial launch boundaries"
    />
  );
}
