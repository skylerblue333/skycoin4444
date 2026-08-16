import UnavailableFeature from "@/components/UnavailableFeature";

export default function YieldFarmingPage() {
  return (
    <UnavailableFeature
      name="Yield farming"
      reason="Verified pool contracts, liquidity positions, APY and reward calculations, deposits, withdrawals, claims, transaction settlement, and operational telemetry are not connected to production DeFi infrastructure. The former page used unsupported activity and success metrics, so it is gated rather than presented as live yield farming."
    />
  );
}
