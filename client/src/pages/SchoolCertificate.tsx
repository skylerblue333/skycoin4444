import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function SchoolCertificate() {
  return (
    <FeatureUnavailable
      title="Certificates are not enabled yet"
      description="Course completion, scores, instructor attribution, certificate hashes, on-chain verification, XP, and shareable credentials require verified learning records, assessment persistence, identity controls, certificate issuance, and an actual chain or registry. The current release does not fabricate a certificate or claim that a credential was issued or verified."
      capability="Education certificates, verification, and achievement records"
      nextStep="Explore the education launch boundary"
    />
  );
}
