import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function StripeCheckout() {
  return (
    <FeatureUnavailable
      title="Paid subscriptions are not enabled yet"
      description="Subscription plans, prices, promotional discounts, payment processing, activation, refund terms, and billing status require a verified Stripe account, product catalog, tax and legal terms, webhook reconciliation, entitlement provisioning, and cancellation controls. The current release does not display actionable prices or claim that a payment or subscription succeeded."
      capability="Stripe checkout, subscriptions, billing, and entitlements"
      nextStep="Review the launch hub"
    />
  );
}
