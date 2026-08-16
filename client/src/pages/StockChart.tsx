import UnavailableFeature from "@/components/UnavailableFeature";

export default function StockChartPage() {
  return (
    <UnavailableFeature
      name="Stock charts"
      reason="Live price charts, market search, watchlists, and alert settings are not connected to a verified market-data provider. This placeholder is gated instead of implying that stock or token charting is operational."
    />
  );
}
