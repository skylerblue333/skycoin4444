import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AdminWalletManager() {
  return (
    <FeatureUnavailable
      title="Admin wallet management is not active"
      description="Custodial wallet administration, rewards, balances, transfers, and transaction polling require a verified custody provider, admin authorization policy, reconciliation workflow, audit logging, and rollback controls. No wallet action is presented as successful until those contracts are configured and tested."
      capability="Admin wallet management"
      nextStep="Use the read-only Wallet Overview for persisted account records"
    />
  );
}
