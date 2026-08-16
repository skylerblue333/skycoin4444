import UnavailableFeature from "@/components/UnavailableFeature";

export default function PaymentsPage() {
  return (
    <UnavailableFeature
      name="Payments and subscriptions"
      reason="Subscription checkout, payment-method setup, order history, refunds, token discounts, and payment settlement are not connected to a verified production billing provider. The current Stripe/test-card and SKY444 payment claims are therefore gated until end-to-end billing, webhook, authorization, and reconciliation controls are implemented."
    />
  );
}
