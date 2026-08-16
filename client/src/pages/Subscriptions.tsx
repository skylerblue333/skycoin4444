import UnavailableFeature from "@/components/UnavailableFeature";

export default function SubscriptionsPage() {
  return (
    <UnavailableFeature
      name="Subscriptions"
      reason="Platform plan prices, creator subscriptions, monthly spend, paid history, and billing state are not sourced from verified payment and subscription records. This static billing surface is gated until real checkout and billing contracts are connected."
    />
  );
}
