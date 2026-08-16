import FeatureUnavailable from "@/components/FeatureUnavailable";

const CryptoEnhancementsPage = () => {
  return (
    <FeatureUnavailable
      title="Crypto enhancements are not enabled yet"
      description="Mining, wallet custody, multi-signature support, hardware-wallet integration, swaps, trading tools, staking, yield farming, and governance require verified chain integrations, market-data providers, transaction signing, custody controls, risk disclosures, and reconciliation. The current release does not promise returns, instant settlement, or successful crypto actions."
      capability="Crypto integrations, trading, mining, staking, and wallet enhancements"
      nextStep="Explore the launch hub"
    />
  );
};

export default CryptoEnhancementsPage;
