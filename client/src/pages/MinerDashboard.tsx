import UnavailableFeature from "@/components/UnavailableFeature";

export default function MinerDashboardPage() {
  return (
    <UnavailableFeature
      name="Miner dashboard"
      reason="Verified worker telemetry, hashrate, pool connectivity, accepted shares, rewards, USD valuation, payouts, and mining-session history are not connected to auditable mining and blockchain infrastructure. The former dashboard used static worker and earnings data and claimed normal pool operation, so it is gated rather than presented as live mining activity."
    />
  );
}
