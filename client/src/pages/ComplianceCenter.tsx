import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ComplianceCenter() {
  return (
    <FeatureUnavailable
      title="Compliance services are not enabled yet"
      description="KYC submission, identity verification, compliance scoring, consent persistence, audit records, data export, and account deletion require verified providers, retention controls, lawful processing, access controls, and tested operational workflows. The current release does not collect identity documents or claim regulatory approval."
      capability="KYC, compliance processing, and privacy-request execution"
      nextStep="Explore the launch hub"
    />
  );
}
