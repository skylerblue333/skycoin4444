import UnavailableFeature from "@/components/UnavailableFeature";

export default function UnifiedPaymentLedgerPage() {
  return (
    <UnavailableFeature
      name="Unified payment ledger"
      reason="Payment balances, transaction history, tips, subscriptions, token swaps, marketplace orders, payouts, and revenue KPIs are not sourced from verified payment, wallet, or accounting records. This static ledger is gated to prevent fabricated financial history."
    />
  );
}
