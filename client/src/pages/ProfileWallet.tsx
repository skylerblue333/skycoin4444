import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ProfileWallet() {
  return (
    <FeatureUnavailable
      title="Profile Wallet is not enabled yet"
      description="Wallet balances, addresses, USD conversions, deposits, transfers, activity history, tips, earnings, rewards, and transaction states require verified custody or wallet infrastructure, ledger reconciliation, address ownership, network configuration, and secure transaction handling. The current release does not display fallback money values or claim that a financial action occurred."
      capability="Profile-linked wallet, balances, activity, and monetization"
      nextStep="Review the financial launch boundaries"
    />
  );
}
