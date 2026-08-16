import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function NFTGallery() {
  return (
    <FeatureUnavailable
      title="N F T Gallery is not active"
      description="This wallet or crypto capability contains unverified provider behavior or financial data. It remains gated until authenticated ownership, network/provider validation, transaction status, reconciliation, secure key handling, error recovery, and operational evidence are complete."
      capability="N F T Gallery"
      nextStep="Use the read-only Wallet Overview for persisted account records"
    />
  );
}
