import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function StreamGifting() {
  return (
    <FeatureUnavailable
      title="Stream Gifting is not enabled yet"
      description="Live streams, viewer counts, gift catalogs, balances, top-up actions, gifting transactions, leaderboards, and animated incoming gifts require verified streaming presence, payment or wallet infrastructure, ledger reconciliation, moderation, and anti-fraud controls. The current release does not fabricate balances or claim that a gift was sent, received, or settled."
      capability="Live streaming, gifting, balances, and creator transaction history"
      nextStep="Explore the social launch boundaries"
    />
  );
}
