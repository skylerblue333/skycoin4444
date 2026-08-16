import UnavailableFeature from "@/components/UnavailableFeature";

export default function InvestorRoomPage() {
  return (
    <UnavailableFeature
      name="Investor room"
      reason="Verified investor identity, holdings, revenue, treasury balances, allocation percentages, tokenomics, roadmap status, private-sale allocation, and partnership activity are not connected to authoritative financial records or access-controlled investor contracts. This route is gated so zero/unavailable data cannot be mistaken for investor reporting or an offering."
    />
  );
}
