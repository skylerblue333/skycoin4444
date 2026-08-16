import UnavailableFeature from "@/components/UnavailableFeature";

export default function StakingDashboardPage() {
  return (
    <UnavailableFeature
      name="Staking dashboard"
      reason="Staked balances, APY, reward accrual, lock periods, claim history, and staking transactions are not connected to a verified blockchain or audited accounting integration. The current route is only an incomplete shell, so it is gated instead of presenting an empty rewards dashboard."
    />
  );
}
