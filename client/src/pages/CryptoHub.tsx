import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CryptoHub() {
  return (
    <FeatureUnavailable
      title="CryptoHub is not enabled yet"
      description="Wallet balances, market prices, mining, swaps, staking, burns, and transaction history require a verified ledger, chain/provider integration, authorization model, transaction confirmation, and monitoring. The current release intentionally does not display demo balances, fallback prices, simulated rewards, or fake transaction success."
      capability="Financial and blockchain operations"
      nextStep="Explore the launch hub"
    />
  );
}
