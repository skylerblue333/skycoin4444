import UnavailableFeature from "@/components/UnavailableFeature";

export default function TradingTerminalPage() {
  return (
    <UnavailableFeature
      name="Trading terminal"
      reason="Live quotes, charts, order entry, recent trades, and settlement are not connected to a verified exchange or market-data integration. This simulated terminal is gated to prevent fabricated financial activity."
    />
  );
}
