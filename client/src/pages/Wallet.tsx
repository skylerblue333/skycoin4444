import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function WalletPage() {
  return (
    <FeatureUnavailable
      title="Wallet is not enabled yet"
      description="Wallet connection, addresses, balances, transaction history, sends, fees, staking, mining, and rewards require verified chain integration, address validation, wallet-signature handling, idempotency, confirmation tracking, and rollback or reconciliation procedures. The current release does not display generated addresses or claim that any transaction, balance, fee, or reward is real."
      capability="Wallet connection, custody, transfers, and financial ledger operations"
      nextStep="Explore the launch hub"
    />
  );
}
