import UnavailableFeature from "@/components/UnavailableFeature";

export default function TipJarPage() {
  return (
    <UnavailableFeature
      name="Tip jar"
      reason="Verified tip amounts, wallet debits, creator credits, USD/SKY conversion, recent tip history, leaderboards, and payout settlement are not connected to production payment or ledger contracts. The current UI contains hard-coded activity and can show success without a verified mutation, so it is gated until tipping is implemented end-to-end."
    />
  );
}
