import UnavailableFeature from "@/components/UnavailableFeature";

export default function AdminOrdersPage() {
  return (
    <UnavailableFeature
      name="Admin orders"
      reason="Verified order records, buyers, products, amounts, fees, taxes, payment methods, fulfillment status, exports, and tax-compliance logs are not connected to a production commerce or accounting system. This static administrative table is gated so fabricated financial records cannot be treated as real orders."
    />
  );
}
