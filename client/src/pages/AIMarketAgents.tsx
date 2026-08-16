import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AIMarketAgents() {
  return (
    <FeatureUnavailable
      title="AI Market Agents are not enabled yet"
      description="Market signals, token prices, ICO progress, investor counts, APY, sentiment, confidence scores, and autonomous agent cycles require verified market-data providers, timestamped provenance, model validation, financial-risk controls, and an auditable execution boundary. The current release does not present synthetic investment intelligence or claim that agents are active."
      capability="AI market analysis, signals, and financial intelligence"
      nextStep="Explore the launch hub"
    />
  );
}
