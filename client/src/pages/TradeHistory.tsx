import UnavailableFeature from "@/components/UnavailableFeature";

export default function TradeHistoryPage() {
  return (
    <UnavailableFeature
      name="Trade history"
      reason="Verified fills, prices, quantities, fees, balances, order identifiers, execution status, cancellations, and settlement history are not connected to a production exchange or brokerage contract. The current route is only an incomplete shell, so it is gated until trading records are authoritative and auditable."
    />
  );
}
