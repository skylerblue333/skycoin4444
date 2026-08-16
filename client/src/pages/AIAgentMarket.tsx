import UnavailableFeature from "@/components/UnavailableFeature";

export default function AIAgentMarketPage() {
  return (
    <UnavailableFeature
      name="AI Agent Market"
      reason="Agent prices, usage counts, subscriptions, paid execution, downloadable results, and payment settlement are not connected to verified AI-commerce and billing contracts. Stripe is not connected, so this market surface is gated instead of claiming unlock success."
    />
  );
}
