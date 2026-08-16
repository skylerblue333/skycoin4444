import UnavailableFeature from "@/components/UnavailableFeature";

export default function UnifiedWalletPage() {
  return (
    <UnavailableFeature
      name="Unified wallet"
      reason="Wallet balances, token valuations, portfolio performance, transaction history, and transfer settlement are not sourced from verified wallet custody and chain integrations. This simulated wallet surface is gated to prevent fabricated financial state."
    />
  );
}
