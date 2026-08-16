import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CryptoResearchHub() {
  return (
    <FeatureUnavailable
      title="Crypto Research Hub is not active"
      description="This wallet or crypto capability contains unverified provider behavior or financial data. It remains gated until authenticated ownership, network/provider validation, transaction status, reconciliation, secure key handling, error recovery, and operational evidence are complete."
      capability="Crypto Research Hub"
      nextStep="Use the read-only Wallet Overview for persisted account records"
    />
  );
}
