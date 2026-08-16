import UnavailableFeature from "@/components/UnavailableFeature";

export default function PortfolioRebalancePage() {
  return (
    <UnavailableFeature
      name="Portfolio rebalance"
      reason="Verified holdings, market prices, allocation targets, risk calculations, trade planning, execution, settlement, and performance telemetry are not connected to a production portfolio or brokerage integration. This placeholder is gated so live-update, automation, success-rate, and transaction claims cannot be mistaken for real portfolio operations."
    />
  );
}
