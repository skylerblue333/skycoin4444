import UnavailableFeature from "@/components/UnavailableFeature";

export default function OrderPlacementPage() {
  return (
    <UnavailableFeature
      name="Order placement"
      reason="Order validation, account balances, pricing, submission, execution, cancellation, and settlement are not connected to a verified exchange or brokerage contract. This route remains gated so it cannot imply real financial activity."
    />
  );
}
