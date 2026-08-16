import UnavailableFeature from "@/components/UnavailableFeature";

export default function DayTradeRoomPage() {
  return (
    <UnavailableFeature
      name="Day Trade Room"
      reason="Trading execution, AI signals, trade history, profit/loss, and win-rate reporting are not connected to a verified production brokerage or market-data integration. This route is gated to prevent simulated financial activity."
    />
  );
}
