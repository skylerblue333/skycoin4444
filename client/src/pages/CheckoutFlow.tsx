import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CheckoutFlow() {
  return (
    <FeatureUnavailable
      title="Checkout Flow is not active"
      description="Payment, billing, subscription, payout, or checkout behavior requires a verified provider account, authenticated ownership, authorization, webhook reconciliation, refund handling, idempotency, audit logging, and operational evidence. No charge, payout, subscription, or payment-success state is presented as real here."
      capability="Checkout Flow"
      nextStep="Return to the launch hub"
    />
  );
}
