import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CharityLeaderboard() {
  return (
    <FeatureUnavailable
      title="Charity Leaderboard is not enabled yet"
      description="Donation totals, donor rankings, campaign goals, progress percentages, impact analytics, and donor tiers require verified payment processing, campaign governance, charitable-partner records, reconciliation, privacy controls, and impact evidence. The current release does not fabricate donations or imply that a campaign, donor, payment, or real-world outcome exists."
      capability="Charitable campaigns, donations, rankings, and impact reporting"
      nextStep="Review the launch hub"
    />
  );
}
