import UnavailableFeature from "@/components/UnavailableFeature";

export default function StakingHubPage() {
  return (
    <UnavailableFeature
      name="Staking hub"
      reason="Verified staking custody, pool availability, APY history, reward calculations, lock periods, claim transactions, and platform telemetry are not connected to a production blockchain or audited accounting integration. This route is gated so it cannot imply staking returns or successful transactions."
    />
  );
}
