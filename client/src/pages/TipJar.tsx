import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function TipJar() {
  return (
    <FeatureUnavailable
      title="Creator tipping is not enabled yet"
      description="Creator identities, tip amounts, wallet balances, USD conversions, leaderboards, recent transfers, and tipping success require verified payment or wallet infrastructure, recipient ownership, ledger reconciliation, anti-fraud controls, and durable transaction status. The current release does not fabricate creator earnings or claim that a tip was sent or received."
      capability="Creator tipping, balances, transfers, and tip history"
      nextStep="Review the financial launch boundaries"
    />
  );
}
