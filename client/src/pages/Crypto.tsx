import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Crypto() {
  return (
    <FeatureUnavailable
      title="Crypto Wallet is not enabled yet"
      description="Wallet balances, market prices, transaction history, swaps, yield farming, insurance coverage, APY, and TVL require verified chain providers, custody or wallet-connect controls, signed transaction handling, market-data provenance, and reconciliation. The current release does not display hard-coded financial data or claim that a transaction, balance, yield, or coverage exists."
      capability="Crypto wallet, portfolio, market data, and DeFi operations"
      nextStep="Explore the launch hub"
    />
  );
}
