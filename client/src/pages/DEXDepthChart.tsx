import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function DEXDepthChart() {
  return (
    <FeatureUnavailable
      title="DEX market data is not enabled yet"
      description="Order books, prices, spreads, volume, TVL, liquidity pools, and candles require a verified exchange or market-data provider, timestamped source records, resilient ingestion, and clear stale-data handling. The current release does not generate random financial data or claim that a market, order, pool, price, or trade exists."
      capability="DEX depth, price charts, liquidity pools, and market analytics"
      nextStep="Review the crypto and financial launch boundaries"
    />
  );
}
