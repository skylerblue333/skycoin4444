import UnavailableFeature from "@/components/UnavailableFeature";

export default function EnterpriseBillingPage() {
  return (
    <UnavailableFeature
      name="Enterprise billing"
      reason="Verified subscription state, pricing, invoices, payment methods, usage metering, charges, refunds, and billing-provider reconciliation are not connected to production billing infrastructure. The former page used mock invoices, a fabricated payment method, and static usage values, so it is gated rather than implying real financial or payment state."
    />
  );
}
