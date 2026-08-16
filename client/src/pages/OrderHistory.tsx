import UnavailableFeature from "@/components/UnavailableFeature";

export default function OrderHistoryPage() {
  return (
    <UnavailableFeature
      name="Order history"
      reason="Verified purchase and sales records, amounts, payment status, fulfillment, reviews, invoices, refunds, and total-spent calculations are not connected to a production commerce, payment, or accounting store. The current procedure returns an empty placeholder, so this route is gated rather than presenting unsupported order history."
    />
  );
}
