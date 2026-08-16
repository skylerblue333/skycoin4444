import UnavailableFeature from "@/components/UnavailableFeature";

export default function PricingPage() {
  return (
    <UnavailableFeature
      name="Pricing"
      reason="Plan pricing, payment methods, free trials, revenue sharing, and upgrade/downgrade billing are not connected to verified subscription and checkout contracts. This static pricing surface is gated until real billing workflows exist."
    />
  );
}
