import UnavailableFeature from "@/components/UnavailableFeature";

export default function PaymentSetupPage() {
  return (
    <UnavailableFeature
      name="Payment setup"
      reason="Billing configuration, subscription plans, invoice generation, payment authorization, customer identity, and provider webhooks are not connected to a production payments integration. The current route is only a local placeholder, so it is gated until setup and reconciliation flows are implemented and audited."
    />
  );
}
