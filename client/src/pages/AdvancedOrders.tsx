import UnavailableFeature from "@/components/UnavailableFeature";

export default function AdvancedOrdersPage() {
  return (
    <UnavailableFeature
      name="Advanced orders"
      reason="Order books, balances, pricing, validation, execution, settlement, transaction history, and exchange telemetry are not verified end-to-end. This placeholder order surface is gated so it cannot imply real trading or fabricated platform metrics."
    />
  );
}
