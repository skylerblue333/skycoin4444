import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Charity() {
  return (
    <FeatureUnavailable
      title="Charity Hub is not enabled yet"
      description="Campaigns, donations, DAO allocation votes, donor rankings, beneficiaries, nonprofit partners, impact reports, disbursement timing, and on-chain transparency require verified charitable entities, payment custody, recipient due diligence, sanctions screening, consent, reconciliation, and public audit evidence. The current release does not solicit donations or claim that funds, votes, beneficiaries, or partnerships are real."
      capability="Charitable campaigns, donations, governance, and impact reporting"
      nextStep="Explore the launch hub"
    />
  );
}
