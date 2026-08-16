import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function OrderHistory() {
  return (
    <FeatureUnavailable
      title="Order History is not enabled yet"
      description="Marketplace purchases, seller orders, totals, escrow, delivery progress, reviews, invoices, refunds, and sales history require verified payment, inventory, fulfillment, dispute, ledger, and document services. The current release does not show generated orders or financial totals and does not claim that an order, delivery, review, invoice, or refund exists."
      capability="Marketplace ordering, fulfillment, escrow, and order history"
      nextStep="Explore the launch hub"
    />
  );
}
