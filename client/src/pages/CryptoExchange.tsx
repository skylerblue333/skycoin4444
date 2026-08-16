import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CryptoExchange() {
  return (
    <FeatureUnavailable
      title="Crypto exchange is not active"
      description="Trading, market data, order execution, balances, transaction status, and exchange analytics require verified provider connectivity, authorization, ledger persistence, risk controls, and monitoring. This release does not claim exchange activity or performance that has not been proven."
      capability="Crypto exchange orders and live market data"
      nextStep="Return to the launch hub"
    />
  );
}
