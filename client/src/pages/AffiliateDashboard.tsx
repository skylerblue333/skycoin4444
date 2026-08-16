import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AffiliateDashboard() {
  return (
    <FeatureUnavailable
      title="Affiliate Program is not enabled yet"
      description="Referral links, attribution, referral counts, commission tiers, token earnings, referred-user records, and withdrawals require verified identity binding, consent, fraud prevention, tax handling, durable attribution, and payout reconciliation. The current release does not generate referral identities or claim that a commission or withdrawal exists."
      capability="Affiliate referrals, commissions, token rewards, and payouts"
      nextStep="Explore the launch hub"
    />
  );
}
