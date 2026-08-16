import UnavailableFeature from "@/components/UnavailableFeature";

export default function WalletIntegrationPage() {
  return (
    <UnavailableFeature
      name="Wallet integration"
      reason="Provider connections, wallet import validation, chain and network checks, signer authorization, transaction signing, and status reconciliation are not connected to verified custody infrastructure. This route remains gated until those security-sensitive flows are implemented and tested."
    />
  );
}
