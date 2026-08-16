import UnavailableFeature from "@/components/UnavailableFeature";

export default function PaymentInfraPage() {
  return (
    <UnavailableFeature
      name="Payment infrastructure"
      reason="Verified payment processors, webhooks, ledger accounting, idempotency, double-spend prevention, rollback, escrow, revenue, cost, margin, credit conversion, transaction history, and subscription plans are not connected to deployed production services. This architecture shell is gated so static claims cannot be mistaken for operational payment infrastructure or financial reporting."
    />
  );
}
