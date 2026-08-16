import UnavailableFeature from "@/components/UnavailableFeature";

export default function PortfolioOverviewPage() {
  return (
    <UnavailableFeature
      name="Portfolio overview"
      reason="Holdings, market prices, cost basis, allocation, performance, and portfolio history are not connected to a verified production data integration. The current route is only an incomplete shell, so it is gated instead of presenting an empty investment dashboard."
    />
  );
}
