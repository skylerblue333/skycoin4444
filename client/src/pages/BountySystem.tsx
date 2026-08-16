import FeatureUnavailable from "@/components/FeatureUnavailable";

export function BountySystem() {
  return (
    <FeatureUnavailable
      title="Bounty System is not enabled yet"
      description="Translation jobs, deadlines, qualifications, submissions, ratings, XP, and monetary rewards require verified task sourcing, escrow or payout infrastructure, review workflows, dispute handling, tax controls, and durable completion records. The current release does not show mock bounties or claim that work was accepted, completed, rated, or paid."
      capability="Translation bounties, work submissions, reviews, and rewards"
      nextStep="Explore the education hub"
    />
  );
}

export default BountySystem;
