import UnavailableFeature from "@/components/UnavailableFeature";

export default function WalletConnectPage() {
  return (
    <UnavailableFeature
      name="Wallet connection"
      reason="Wallet connection state, chain validation, account ownership, signer authorization, network switching, and transaction approval are not connected to verified custody or wallet-provider infrastructure. The current route is only an incomplete shell, so it is gated until those security-sensitive flows are implemented and tested."
    />
  );
}
