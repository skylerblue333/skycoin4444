import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function InvestorPortal() {
  return (
    <FeatureUnavailable
      title="Investor Portal is not enabled yet"
      description="Token sales, pricing, tokenomics, vesting, referrals, KYC/AML, investor balances, claims, leaderboards, and checkout require verified legal approval, a regulated or approved payment boundary, custody and ledger controls, jurisdictional review, reconciliation, and independently published documents. The current release does not solicit funds or claim that SKY444 has a live price, sale, allocation, or investment value."
      capability="Token sale, investor portfolio, and financial participation workflows"
      nextStep="Explore the launch hub"
    />
  );
}
