import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function InvestorRoom() {
  return (
    <FeatureUnavailable
      title="Investor Room is not enabled yet"
      description="Investor KPIs, users, revenue, treasury, tokenomics, token price, roadmap completion, allocations, private-sale access, and partnership offers require independently verifiable financial records, securities and marketing review, authoritative chain data, audited reporting, and secure document distribution. The current release does not solicit investment or present generated financial figures as evidence."
      capability="Investor reporting, tokenomics, fundraising, and financial communications"
      nextStep="Explore the launch hub"
    />
  );
}
