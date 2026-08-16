import UnavailableFeature from "@/components/UnavailableFeature";

export default function StripeCheckoutPage() {
  return (
    <UnavailableFeature
      name="Stripe checkout"
      reason="Stripe checkout sessions, payment authorization, promo validation, subscription activation, refunds, PCI/security attestations, and order settlement are not connected to a verified payment integration. The current server procedure returns unavailable while the UI can show demo success, so this route is gated until real payment contracts and webhook reconciliation exist."
    />
  );
}
