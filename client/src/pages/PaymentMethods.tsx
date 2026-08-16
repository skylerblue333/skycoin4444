import UnavailableFeature from "@/components/UnavailableFeature";

export default function PaymentMethodsPage() {
  return (
    <UnavailableFeature
      name="Payment methods"
      reason="Secure payment-provider setup, tokenized instrument storage, verification, removal, billing authorization, and PCI-scoped handling are not connected to a production payments integration. The current route is only a local placeholder, so it is gated until those security-sensitive controls are implemented and audited."
    />
  );
}
