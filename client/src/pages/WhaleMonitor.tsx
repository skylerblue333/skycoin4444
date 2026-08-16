import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function WhaleMonitor() {
  return (
    <FeatureUnavailable
      title="Whale Monitor is not enabled yet"
      description="Large-transaction feeds, wallet identifiers, USD values, volume, holder impact, alerts, and live refresh require verified chain-indexing or market-data infrastructure, source timestamps, address validation, and stale-data handling. The current release does not generate transactions or claim that a whale trade, transfer, or stake occurred."
      capability="Large-transaction monitoring and on-chain market analytics"
      nextStep="Review the crypto and financial launch boundaries"
    />
  );
}
