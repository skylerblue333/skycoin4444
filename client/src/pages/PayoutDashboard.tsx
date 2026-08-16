import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function PayoutDashboard() {
  return (
    <FeatureUnavailable
      title="Payouts are not enabled yet"
      description="Creator earnings, available balances, payout methods, platform fees, payout history, tax forms, and transfer status require verified monetization, payment-provider and bank or wallet integrations, tax configuration, identity verification, reconciliation, and auditable settlement. The current release does not display fallback money values or claim that a payout was requested, completed, or failed."
      capability="Creator payouts, earnings, transfers, and tax reporting"
      nextStep="Review the financial and commerce launch boundaries"
    />
  );
}
