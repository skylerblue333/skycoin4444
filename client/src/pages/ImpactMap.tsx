import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ImpactMap() {
  return (
    <FeatureUnavailable
      title="Charity impact mapping is not enabled yet"
      description="Donation totals, beneficiaries, campaign progress, geographic allocation, live donation feeds, and impact outcomes require verified charitable payments, campaign records, beneficiary privacy controls, partner attestations, and independently auditable reporting. The current release does not fabricate global impact or claim that a donation changed a life."
      capability="Charity campaigns, impact map, and beneficiary reporting"
      nextStep="Review the charity and evidence boundaries"
    />
  );
}
