import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function EconomicLayer() {
  return (
    <FeatureUnavailable
      title="Economic Layer is not enabled yet"
      description="Token balances, ledgers, fees, welcome bonuses, treasury totals, and rich-list rankings require a verified accounting system, authorization rules, idempotent writes, reconciliation, and an auditable data boundary. The current release does not display synthetic economic activity or claim that tokens have monetary value."
      capability="Token economy, ledger, treasury, and balance operations"
      nextStep="Explore the launch hub"
    />
  );
}
