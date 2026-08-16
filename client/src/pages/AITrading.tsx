import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AITrading() {
  return (
    <FeatureUnavailable
      title="AI Trading is not enabled yet"
      description="Trading signals, automated strategies, portfolio analytics, performance metrics, risk controls, market intelligence, and order execution require verified market-data feeds, broker or exchange integration, model validation, suitability controls, audit logs, and transaction settlement. The current release does not fabricate returns or claim that a trade or portfolio action occurred."
      capability="AI trading signals, automation, portfolio analytics, and execution"
      nextStep="Review the crypto and financial launch boundaries"
    />
  );
}
