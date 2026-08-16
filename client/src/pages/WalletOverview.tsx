import UnavailableFeature from "@/components/UnavailableFeature";

export default function WalletOverviewPage() {
  return (
    <UnavailableFeature
      name="Wallet overview"
      reason="Verified wallet addresses, balances, transaction history, custody controls, network status, and send/receive workflows are not connected to a production wallet integration. The current route is an incomplete placeholder, so its activation control has been removed rather than presented as wallet functionality."
    />
  );
}
