import UnavailableFeature from "@/components/UnavailableFeature";

export default function LiveGiftingPage() {
  return (
    <UnavailableFeature
      name="Live gifting"
      reason="Gift catalog pricing, wallet debits, creator credits, recipient delivery, revenue sharing, participant activity, and settlement are simulated locally and are not connected to verified payment, ledger, or creator-payout contracts. This route is gated so it cannot imply real SKY transfers or earnings."
    />
  );
}
