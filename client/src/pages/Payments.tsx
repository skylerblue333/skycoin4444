import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Payments() {
  return (
    <FeatureUnavailable
      title="Payments are not enabled yet"
      description="Paid plans, prices, payment methods, token discounts, checkout sessions, test-card instructions, order history, refunds, and subscription entitlements require verified payment-provider configuration, product catalog, tax and legal terms, webhook reconciliation, and secure provisioning. The current release does not display actionable billing data or claim that a payment or subscription succeeded."
      capability="Payments, subscriptions, payment methods, and order history"
      nextStep="Review the launch hub"
    />
  );
}
