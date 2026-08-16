import UnavailableFeature from "@/components/UnavailableFeature";

export default function PayoutDashboardPage() {
  return (
    <UnavailableFeature
      name="Payout dashboard"
      reason="Creator earnings, payout balances, payout history, tax reporting, and bank or crypto settlement are not connected to a verified payment contract. This route is gated to prevent fabricated payout success or financial records."
    />
  );
}
