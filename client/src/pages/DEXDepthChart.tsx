import UnavailableFeature from "@/components/UnavailableFeature";

export default function DEXDepthChartPage() {
  return (
    <UnavailableFeature
      name="DEX market depth"
      reason="Verified order-book data, market prices, liquidity pools, volume, spreads, OHLCV history, swap execution, and liquidity provisioning are not connected to production exchange or chain integrations. The former chart generated synthetic financial data and exposed unsupported controls, so it is gated rather than presented as live market infrastructure."
    />
  );
}
