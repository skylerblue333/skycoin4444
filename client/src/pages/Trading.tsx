import UnavailableFeature from "@/components/UnavailableFeature";

export default function Trading() {
  return (
    <UnavailableFeature
      name="Trading terminal"
      reason="Live market data, order execution, portfolio valuation, and trading-bot control are not connected to verified production integrations."
    />
  );
}
