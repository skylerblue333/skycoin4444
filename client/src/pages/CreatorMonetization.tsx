import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CreatorMonetization() {
  return (
    <FeatureUnavailable
      title="Creator Monetization is not enabled yet"
      description="Subscriptions, tips, sponsorships, gifts, memberships, affiliate earnings, revenue charts, payouts, milestones, and growth advice require verified payment providers, attribution, tax and compliance handling, creator-owned records, reconciliation, and audited analytics. The current release does not render random revenue data or claim earnings, payout completion, or monetization availability."
      capability="Creator monetization, payouts, revenue analytics, and growth advice"
      nextStep="Explore the launch hub"
    />
  );
}
