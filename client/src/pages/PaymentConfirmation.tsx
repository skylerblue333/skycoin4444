import UnavailableFeature from "@/components/UnavailableFeature";

export default function PaymentConfirmationPage() {
  return (
    <UnavailableFeature
      name="Payment confirmation"
      reason="Verified payment status, provider transaction identifiers, settlement reconciliation, refund state, and order activation are not connected to a production payment integration. The current route is only a local placeholder, so it is gated rather than presenting unsupported payment success."
    />
  );
}
