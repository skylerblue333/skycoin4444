import UnavailableFeature from "@/components/UnavailableFeature";

export default function MiningDashboardPage() {
  return (
    <UnavailableFeature
      name="Mining dashboard"
      reason="Verified mining status, hashrate, worker execution, session history, coin generation, rewards, wallet payouts, USD valuation, and pool settlement are not connected to an auditable mining and blockchain infrastructure. The current UI also contains static multi-asset earnings data, so it is gated rather than presenting simulated mining activity as real output."
    />
  );
}
