import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ProofVault() {
  return (
    <FeatureUnavailable
      title="Proof Vault is not enabled yet"
      description="Revenue, treasury, token burns, wallet statistics, audit outcomes, legal registration, compliance status, WAF and SSL posture, uptime, and security metrics require authoritative source systems, signed reports, traceable documents, public verification links, and independent review. The current release does not present generated financial, legal, security, or audit data as proof."
      capability="Public financial, legal, security, audit, and infrastructure evidence"
      nextStep="Review the production evidence requirements"
    />
  );
}
