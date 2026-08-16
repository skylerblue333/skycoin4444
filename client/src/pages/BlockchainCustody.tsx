import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function BlockchainCustody() {
  return (
    <FeatureUnavailable
      title="Blockchain custody is not enabled yet"
      description="Wallet registration, address derivation, on-chain balances, gas estimates, signing, and broadcast require independently verified chain providers, key-management controls, transaction reconciliation, and a tested rollback process. This release does not claim custodial security or blockchain transaction success."
      capability="Non-custodial wallet and blockchain transaction operations"
      nextStep="Explore the launch hub"
    />
  );
}
